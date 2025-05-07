SET TIME ZONE 'UTC';

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DROP TABLE IF EXISTS verification_token, accounts, sessions, users, admin, customer, address, customer_address, payment_method, category, item, customer_order, order_item, delivery, discount, sale, coupon, transaction CASCADE;

-- Tables for NextAuth Postgres Adapter
CREATE TABLE verification_token
(
  identifier TEXT NOT NULL,
  expires TIMESTAMPTZ NOT NULL,
  token TEXT NOT NULL,
  PRIMARY KEY (identifier, token)
);

CREATE TABLE accounts
(
  id SERIAL,
  "userId" INTEGER NOT NULL,
  type VARCHAR(255) NOT NULL,
  provider VARCHAR(255) NOT NULL,
  "providerAccountId" VARCHAR(255) NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at BIGINT,
  id_token TEXT,
  scope TEXT,
  session_state TEXT,
  token_type TEXT,
  PRIMARY KEY (id)
);

CREATE TABLE sessions
(
  id SERIAL,
  "userId" INTEGER NOT NULL,
  expires TIMESTAMPTZ NOT NULL,
  "sessionToken" VARCHAR(255) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE users
(
  id SERIAL,
  name VARCHAR(255),
  email VARCHAR(255),
  image TEXT,
  "emailVerified" TIMESTAMPTZ,
  register_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (id)
);

CREATE TABLE userspace (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL
);

INSERT INTO userspace (first_name, last_name, email, password, role)
VALUES
('Ivan', 'Gomez', 'igomez9898@gmail.com', 'pass', 'admin');

-- Custom Tables

CREATE TABLE admin
(
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE customer
(
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE address
(
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  street VARCHAR(255) NOT NULL,
  city VARCHAR(255) NOT NULL,
  country VARCHAR(255) NOT NULL,
  state VARCHAR(255) NOT NULL,
  zip VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE customer_address
(
  customer_id UUID NOT NULL,
  address_id UUID NOT NULL,
  PRIMARY KEY (customer_id, address_id),
  FOREIGN KEY (customer_id) REFERENCES customer(id) ON DELETE CASCADE,
  FOREIGN KEY (address_id) REFERENCES address(id) ON DELETE CASCADE
);

CREATE TABLE payment_method
(
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL,
  billing_address_id UUID NOT NULL,
  encrypted_card_number TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE category
(
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


CREATE TABLE item
(
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price_cents INT NOT NULL,
  weight_lbs INT,
  count INT NOT NULL,
  img_src TEXT,
  FOREIGN KEY (category_id) REFERENCES category(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE discount
(
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  amount INT NOT NULL,
  from_date TIMESTAMPTZ,
  to_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE sale
(
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  discount_id UUID NOT NULL,
  item_id UUID,
  category_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  FOREIGN KEY (discount_id) REFERENCES discount(id) ON DELETE CASCADE,
  FOREIGN KEY (item_id) REFERENCES item(id) ON DELETE SET NULL,
  FOREIGN KEY (category_id) REFERENCES category(id) ON DELETE SET NULL
);

CREATE TABLE coupon
(
  code VARCHAR(255) PRIMARY KEY NOT NULL,
  discount_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  FOREIGN KEY (discount_id) REFERENCES discount(id) ON DELETE CASCADE
);

CREATE TYPE order_status AS ENUM ('PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELED');

CREATE TABLE customer_order
(
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL,
  address_id UUID,
  coupon_code VARCHAR(255),
  subtotal INT NOT NULL DEFAULT 0,
  delivery_fee INT NOT NULL DEFAULT 0,
  tax INT NOT NULL DEFAULT 0,
  total INT NOT NULL DEFAULT 0,
  weight_lbs INT NOT NULL DEFAULT 0,
  status order_status NOT NULL DEFAULT 'PENDING',
  scheduled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  FOREIGN KEY (customer_id) REFERENCES customer(id) ON DELETE CASCADE,
  FOREIGN KEY (address_id) REFERENCES address(id) ON DELETE SET NULL,
  FOREIGN KEY (coupon_code) REFERENCES coupon(code) ON DELETE SET NULL
);

-- We can create some kind of trigger for the
-- delivery table s.t. when the scheduled_at date
-- is reached, a new delivery is created using
-- pg_cron or something, but I'm too lazy to
-- figure out how to do that now ;(
--
-- Important clarification on the foreign key fields below:
-- The reason we don't cascade DELETE on addressId
-- and customerId is because we want to keep the
-- delivery record even if the address or customer
-- is deleted. What's the driver going to do when
-- they're on the way to deliver the package and
-- the customer deletes their account?
--
-- Plus, the customer should still recieve their
-- order even if they delete an address or their
-- account. This is why we also include the address
-- information in the delivery table.
--
-- An order can only be deleted on the admin side,
-- so we cascade DELETE on orderId as it is on the
-- admins discretion to delete an order.
CREATE TABLE delivery
(
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  address_id UUID,
  customer_id UUID,
  order_id UUID NOT NULL,
  street VARCHAR(255) NOT NULL,
  city VARCHAR(255) NOT NULL,
  country VARCHAR(255) NOT NULL,
  state VARCHAR(255) NOT NULL,
  zip VARCHAR(255) NOT NULL,
  scheduled_at TIMESTAMPTZ NOT NULL,
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  FOREIGN KEY (address_id) REFERENCES address(id) ON DELETE SET NULL,
  FOREIGN KEY (customer_id) REFERENCES customer(id) ON DELETE SET NULL,
  FOREIGN KEY (order_id) REFERENCES customer_order(id) ON DELETE CASCADE
);

CREATE TABLE order_item
(
  order_id UUID NOT NULL,
  item_id UUID NOT NULL,
  count INT NOT NULL,
  weight_lbs INT NOT NULL DEFAULT 0,
  price_cents INT NOT NULL DEFAULT 0,
  PRIMARY KEY (order_id, item_id),
  FOREIGN KEY (order_id) REFERENCES customer_order(id) ON DELETE CASCADE,
  FOREIGN KEY (item_id) REFERENCES item(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION calculate_order_item_fields()
RETURNS TRIGGER AS $$
DECLARE
  item_record RECORD;
BEGIN
  SELECT weight_lbs, price_cents INTO item_record FROM item WHERE id = NEW.item_id;
  NEW.weight_lbs := item_record.weight_lbs * NEW.count;
  NEW.price_cents := item_record.price_cents * NEW.count;
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER before_order_item_insert_or_update
BEFORE INSERT OR UPDATE ON order_item
FOR EACH ROW
EXECUTE FUNCTION calculate_order_item_fields();

CREATE OR REPLACE FUNCTION apply_coupon_if_valid()
RETURNS TRIGGER AS $$
DECLARE
  coupon_record RECORD;
  discount_record RECORD;
BEGIN
  IF NEW.coupon_code IS NOT NULL THEN
    SELECT * INTO coupon_record FROM coupon WHERE code = NEW.coupon_code;
    IF coupon_record IS NULL THEN
      RAISE EXCEPTION 'Coupon code does not exist';
    END IF;
    SELECT * INTO discount_record FROM discount WHERE id = coupon_record.discount_id;
    IF discount_record IS NULL THEN
      RAISE EXCEPTION 'Discount record does not exist';
    END IF;
    NEW.total := NEW.total - discount_record.amount;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER before_order_insert
BEFORE INSERT ON customer_order
FOR EACH ROW
EXECUTE FUNCTION apply_coupon_if_valid();

-- TODO: Currently sales on items or categories are not implemented. Figure out how to do this in this function.
CREATE OR REPLACE FUNCTION recalculate_order_fields()
RETURNS TRIGGER AS $$
DECLARE
  affected_order_id RECORD;
  new_weight_lbs INT;
  new_subtotal INT;
  new_delivery_fee INT := 0;
  new_tax INT := 500; -- Flat for now...
  new_total INT;
BEGIN
  -- If the order is being created or updated, we use NEW. If it's being deleted, we use OLD.
  affected_order_id := COALESCE(NEW.order_id, OLD.order_id);

  -- Sum all orderItem rows for the affected order
  SELECT COALESCE(SUM(weight_lbs), 0), COALESCE(SUM(price_cents), 0)
  INTO new_weight_lbs, new_subtotal
  FROM order_item
  WHERE order_id = affected_order_id;

  -- Add delivery fee if weight is over 20 lbs
  IF new_weight_lbs > 20 THEN
    new_delivery_fee := 500;
  END IF;

  -- Get the current total of the order so it can be incremented
  SELECT total INTO new_total FROM customer_order WHERE id = affected_order_id;

  -- Increment the total
  new_total := new_total + (new_subtotal + new_delivery_fee + new_tax);

  -- Update the order with the new values
  UPDATE customer_order
  SET weight_lbs = new_weight_lbs,
      subtotal = new_subtotal,
      delivery_fee = new_delivery_fee,
      tax = new_tax,
      total = new_total,
      updated_at = NOW()
  WHERE id = affected_order_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_order_item_change
AFTER INSERT OR UPDATE OR DELETE ON order_item
FOR EACH ROW
EXECUTE FUNCTION recalculate_order_fields();

-- Transactions should be immutable, so we don't
-- cascade DELETE on any of the foreign keys.
CREATE TABLE transaction
(
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL,
  payment_method_id UUID NOT NULL,
  order_id UUID NOT NULL,
  amount INT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  FOREIGN KEY (customer_id) REFERENCES customer(id) ON DELETE NO ACTION,
  FOREIGN KEY (payment_method_id) REFERENCES payment_method(id) ON DELETE NO ACTION,
  FOREIGN KEY (order_id) REFERENCES customer_order(id) ON DELETE NO ACTION
);

-- Seed data

INSERT INTO category (id, name, description)
VALUES
  ('21353cd2-bc13-449f-a2a1-ac1aade1cd97', 'Fruits', 'Fresh fruits'),
  ('15a23cbb-c99d-4ef4-b61b-a9ed190e7906', 'Vegetables', 'Fresh vegetables'),
  ('d77122b9-43f5-4c7e-9890-a6466aeeeb21', 'Dairy', 'Dairy products'),
  ('a470f657-b166-403c-be1c-46f59ddd2830', 'Meat', 'Fresh meat'),
  ('4438b830-012c-46b0-b48d-35b98bb95356', 'Seafood', 'Fresh seafood'),
  ('b1e5e998-dbfa-41b3-9f36-e8a07b600f56', 'Bakery', 'Bakery products'),
  ('54ee8da9-bb51-4b15-8c0d-90a5cb30f744', 'Snacks', 'Snacks and chips'),
  ('1ae0e9cc-e618-4c53-b7d9-299703a4c456', 'Beverages', 'Beverages and drinks');

INSERT INTO item (category_id, name, description, price_cents, weight_lbs, count, img_src)
VALUES
  ('21353cd2-bc13-449f-a2a1-ac1aade1cd97', 'Apple', 'Fresh red apple', 100, 0.5, 100, 'https://picsum.photos/seed/apple/300/300'),
  ('21353cd2-bc13-449f-a2a1-ac1aade1cd97', 'Banana', 'Fresh yellow banana', 50, 0.3, 200, 'https://picsum.photos/seed/banana/300/300'),
  ('21353cd2-bc13-449f-a2a1-ac1aade1cd97', 'Grapes', 'Fresh green grapes', 120, 0.4, 160, 'https://picsum.photos/seed/grapes/300/300'),
  ('21353cd2-bc13-449f-a2a1-ac1aade1cd97', 'Orange', 'Fresh orange fruit', 90, 0.4, 140, 'https://picsum.photos/seed/orange/300/300'),
  ('21353cd2-bc13-449f-a2a1-ac1aade1cd97', 'Pineapple', 'Fresh pineapple fruit', 150, 1.0, 70, 'https://picsum.photos/seed/pineapple/300/300'),
  ('21353cd2-bc13-449f-a2a1-ac1aade1cd97', 'Mango', 'Fresh mango fruit', 130, 0.6, 110, 'https://picsum.photos/seed/mango/300/300'),
  ('15a23cbb-c99d-4ef4-b61b-a9ed190e7906', 'Carrot', 'Fresh orange carrot', 30, 0.2, 150, 'https://picsum.photos/seed/carrot/300/300'),
  ('15a23cbb-c99d-4ef4-b61b-a9ed190e7906', 'Broccoli', 'Fresh green broccoli', 80, 0.4, 120, 'https://picsum.photos/seed/broccoli/300/300'),
  ('15a23cbb-c99d-4ef4-b61b-a9ed190e7906', 'Spinach', 'Fresh spinach leaves', 40, 0.1, 180, 'https://picsum.photos/seed/spinach/300/300'),
  ('15a23cbb-c99d-4ef4-b61b-a9ed190e7906', 'Potato', 'Fresh potato', 60, 0.5, 130, 'https://picsum.photos/seed/potato/300/300'),
  ('15a23cbb-c99d-4ef4-b61b-a9ed190e7906', 'Cucumber', 'Fresh cucumber', 50, 0.3, 160, 'https://picsum.photos/seed/cucumber/300/300'),
  ('15a23cbb-c99d-4ef4-b61b-a9ed190e7906', 'Bell Pepper', 'Fresh bell pepper', 70, 0.3, 150, 'https://picsum.photos/seed/bellpepper/300/300'),
  ('d77122b9-43f5-4c7e-9890-a6466aeeeb21', 'Cheese', 'Fresh cheese', 500, 0.8, 30, 'https://picsum.photos/seed/cheese/300/300'),
  ('d77122b9-43f5-4c7e-9890-a6466aeeeb21', 'Yogurt', 'Creamy yogurt', 250, 0.4, 60, 'https://picsum.photos/seed/yogurt/300/300'),
  ('d77122b9-43f5-4c7e-9890-a6466aeeeb21', 'Butter', 'Creamy butter', 400, 0.3, 40, 'https://picsum.photos/seed/butter/300/300'),
  ('d77122b9-43f5-4c7e-9890-a6466aeeeb21', 'Ice Cream', 'Creamy ice cream', 600, 0.5, 30, 'https://picsum.photos/seed/icecream/300/300'),
  ('d77122b9-43f5-4c7e-9890-a6466aeeeb21', 'Cream Cheese', 'Creamy cream cheese', 450, 0.4, 50, 'https://picsum.photos/seed/creamcheese/300/300'),
  ('d77122b9-43f5-4c7e-9890-a6466aeeeb21', 'Milk', 'Fresh cow milk', 200, 1.0, 50, 'https://picsum.photos/seed/milk/300/300'),
  ('a470f657-b166-403c-be1c-46f59ddd2830', 'Chicken', 'Fresh chicken breast', 800, 1.5, 40, 'https://picsum.photos/seed/chicken/300/300'),
  ('a470f657-b166-403c-be1c-46f59ddd2830', 'Beef', 'Fresh beef steak', 1200, 2.0, 20, 'https://picsum.photos/seed/beef/300/300'),
  ('a470f657-b166-403c-be1c-46f59ddd2830', 'Pork', 'Fresh pork chops', 900, 1.8, 35, 'https://picsum.photos/seed/pork/300/300'),
  ('a470f657-b166-403c-be1c-46f59ddd2830', 'Turkey', 'Fresh turkey breast', 1100, 2.5, 20, 'https://picsum.photos/seed/turkey/300/300'),
  ('a470f657-b166-403c-be1c-46f59ddd2830', 'Lamb', 'Fresh lamb chops', 1300, 2.2, 25, 'https://picsum.photos/seed/lamb/300/300'),
  ('a470f657-b166-403c-be1c-46f59ddd2830', 'Duck', 'Fresh duck breast', 1400, 2.5, 22, 'https://picsum.photos/seed/duck/300/300'),
  ('4438b830-012c-46b0-b48d-35b98bb95356', 'Salmon', 'Fresh salmon fillet', 1500, 1.2, 25, 'https://picsum.photos/seed/salmon/300/300'),
  ('4438b830-012c-46b0-b48d-35b98bb95356', 'Shrimp', 'Fresh shrimp', 2000, 1.5, 15, 'https://picsum.photos/seed/shrimp/300/300'),
  ('4438b830-012c-46b0-b48d-35b98bb95356', 'Tuna', 'Fresh tuna steak', 1600, 1.8, 18, 'https://picsum.photos/seed/tuna/300/300'),
  ('4438b830-012c-46b0-b48d-35b98bb95356', 'Crab', 'Fresh crab legs', 2500, 2.0, 12, 'https://picsum.photos/seed/crab/300/300'),
  ('4438b830-012c-46b0-b48d-35b98bb95356', 'Lobster', 'Fresh lobster tail', 3500, 3.0, 8, 'https://picsum.photos/seed/lobster/300/300'),
  ('b1e5e998-dbfa-41b3-9f36-e8a07b600f56', 'Bread', 'Freshly baked bread', 250, 0.5, 80, 'https://picsum.photos/seed/bread/300/300'),
  ('b1e5e998-dbfa-41b3-9f36-e8a07b600f56', 'Cake', 'Delicious cake', 1000, 1.0, 10, 'https://picsum.photos/seed/cake/300/300'),
  ('b1e5e998-dbfa-41b3-9f36-e8a07b600f56', 'Croissant', 'Flaky croissant', 300, 0.2, 70, 'https://picsum.photos/seed/croissant/300/300'),
  ('b1e5e998-dbfa-41b3-9f36-e8a07b600f56', 'Muffin', 'Delicious muffin', 350, 0.3, 50, 'https://picsum.photos/seed/muffin/300/300'),
  ('b1e5e998-dbfa-41b3-9f36-e8a07b600f56', 'Bagel', 'Freshly baked bagel', 200, 0.4, 60, 'https://picsum.photos/seed/bagel/300/300'),
  ('b1e5e998-dbfa-41b3-9f36-e8a07b600f56', 'Doughnut', 'Delicious doughnut', 400, 0.3, 40, 'https://picsum.photos/seed/doughnut/300/300'),
  ('54ee8da9-bb51-4b15-8c0d-90a5cb30f744', 'Chips', 'Crunchy potato chips', 150, 0.2, 100, 'https://picsum.photos/seed/chips/300/300'),
  ('54ee8da9-bb51-4b15-8c0d-90a5cb30f744', 'Candy', 'Sweet candy', 200, 0.1, 200, 'https://picsum.photos/seed/candy/300/300'),
  ('54ee8da9-bb51-4b15-8c0d-90a5cb30f744', 'Popcorn', 'Buttery popcorn', 100, 0.1, 150, 'https://picsum.photos/seed/popcorn/300/300'),
  ('54ee8da9-bb51-4b15-8c0d-90a5cb30f744', 'Trail Mix', 'Healthy trail mix', 250, 0.4, 80, 'https://picsum.photos/seed/trailmix/300/300'),
  ('54ee8da9-bb51-4b15-8c0d-90a5cb30f744', 'Granola Bar', 'Healthy granola bar', 120, 0.2, 140, 'https://picsum.photos/seed/granolabar/300/300'),
  ('54ee8da9-bb51-4b15-8c0d-90a5cb30f744', 'Beef Jerky', 'Savory beef jerky', 300, 0.2, 120, 'https://picsum.photos/seed/beefjerky/300/300'),
  ('1ae0e9cc-e618-4c53-b7d9-299703a4c456', 'Water', 'Bottled water', 50, 0.5, 200, 'https://picsum.photos/seed/water/300/300'),
  ('1ae0e9cc-e618-4c53-b7d9-299703a4c456', 'Juice', 'Fresh fruit juice', 180, 0.4, 100, 'https://picsum.photos/seed/juice/300/300'),
  ('1ae0e9cc-e618-4c53-b7d9-299703a4c456', 'Soda', 'Refreshing soda drink', 120, 0.3, 150, 'https://picsum.photos/seed/soda/300/300'),
  ('1ae0e9cc-e618-4c53-b7d9-299703a4c456', 'Coffee', 'Freshly brewed coffee', 300, 0.2, 90, 'https://picsum.photos/seed/coffee/300/300'),
  ('1ae0e9cc-e618-4c53-b7d9-299703a4c456', 'Tea', 'Refreshing tea drink', 80, 0.3, 130, 'https://picsum.photos/seed/tea/300/300'),
  ('1ae0e9cc-e618-4c53-b7d9-299703a4c456', 'Energy Drink', 'Boosting energy drink', 250, 0.4, 110, 'https://picsum.photos/seed/energydrink/300/300');


CREATE TABLE products (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name character varying(255),
    price numeric(10, 2),
    weight numeric(6, 2),
    category character varying(255),
    stock integer,
    img_url character varying(255)
);

INSERT INTO products (name, price, weight, category, stock, img_url)
VALUES
('apple', 0.66, 0.5, 'fruit', 85, 'https://res.cloudinary.com/dezsecf8p/image/upload/f_auto,q_auto/v1/Backend%20Pictures/g3efmooigjjmfh0c5gby'),
('banana', 0.63, 0.3, 'fruit', 94, 'https://res.cloudinary.com/dezsecf8p/image/upload/f_auto,q_auto/v1/Backend%20Pictures/vxhy927yhdufovssspqu'),
('orange', 0.51, 0.4, 'fruit', 51, 'https://res.cloudinary.com/dezsecf8p/image/upload/f_auto,q_auto/v1/Backend%20Pictures/j37shkjjza3vuympome9'),
('pineapple', 0.73, 1.0, 'fruit', 97, 'https://res.cloudinary.com/dezsecf8p/image/upload/f_auto,q_auto/v1/Backend%20Pictures/a8fhbdqubjuxfmzpmrva'),
('watermelon', 0.10, 3.5, 'fruit', 50, 'https://res.cloudinary.com/dezsecf8p/image/upload/f_auto,q_auto/v1/Backend%20Pictures/n1fkjcujnwjkmau9sj0o'),
('cantaloupe', 0.15, 2.5, 'fruit', 36, 'https://res.cloudinary.com/dezsecf8p/image/upload/f_auto,q_auto/v1/Backend%20Pictures/r8jg63y0bwdriwswl9po'),
('kiwi', 0.71, 0.2, 'fruit', 60, 'https://res.cloudinary.com/dezsecf8p/image/upload/f_auto,q_auto/v1/Backend%20Pictures/tb1erz38rk5z234ls5id'),
('lettuce', 0.15, 1.0, 'vegetable', 60, 'https://res.cloudinary.com/dezsecf8p/image/upload/f_auto,q_auto/v1/Backend%20Pictures/yfpnxjxgi2jzigbejiad'),
('tomato', 0.37, 0.4, 'vegetable', 0, 'https://res.cloudinary.com/dezsecf8p/image/upload/f_auto,q_auto/v1/Backend%20Pictures/d1650mpjbdhpf4dmqxu0'),
('celery', 0.63, 1.2, 'vegetable', 41, 'https://res.cloudinary.com/dezsecf8p/image/upload/f_auto,q_auto/v1/Backend%20Pictures/y5ssnuv2yzgt73ygw3ar'),
('onion', 0.51, 0.5, 'vegetable', 42, 'https://res.cloudinary.com/dezsecf8p/image/upload/f_auto,q_auto/v1/Backend%20Pictures/qusprabrxivinpasuslh'),
('potato', 0.04, 0.6, 'vegetable', 39, 'https://res.cloudinary.com/dezsecf8p/image/upload/f_auto,q_auto/v1/Backend%20Pictures/ea9oyinehtowadgxuk5i'),
('beef', 0.88, 1.0, 'meat', 96, 'https://res.cloudinary.com/dezsecf8p/image/upload/f_auto,q_auto/v1/Backend%20Pictures/wm7nqbt4vssavp2ede0q'),
('chicken', 0.92, 1.5, 'meat', 90, 'https://res.cloudinary.com/dezsecf8p/image/upload/f_auto,q_auto/v1/Backend%20Pictures/g8i2driimdyzrtmtdysd'),
('fish', 0.65, 1.2, 'meat', 82, 'https://res.cloudinary.com/dezsecf8p/image/upload/f_auto,q_auto/v1/Backend%20Pictures/qd5lqdjhxr9y7gniibeh'),
('pasta', 0.84, 1.0, 'grains', 77, 'https://res.cloudinary.com/dezsecf8p/image/upload/f_auto,q_auto/v1/Backend%20Pictures/lyephxtoj1has6n2ntyz'),
('rice', 0.04, 1.0, 'grains', 88, 'https://res.cloudinary.com/dezsecf8p/image/upload/f_auto,q_auto/v1/Backend%20Pictures/ciwfhsmwsx7bpfv5foyv'),
('milk', 0.66, 2.2, 'dairy', 19, 'https://res.cloudinary.com/dezsecf8p/image/upload/f_auto,q_auto/v1/Backend%20Pictures/fqqi4iqizufbfmgv1jsq'),
('cheese', 0.99, 0.8, 'dairy', 33, 'https://res.cloudinary.com/dezsecf8p/image/upload/f_auto,q_auto/v1/Backend%20Pictures/ia0gepzw3iuclty72s8i'),
('ham', 0.99, 0.7, 'deli', 73, 'https://res.cloudinary.com/dezsecf8p/image/upload/f_auto,q_auto/v1/Backend%20Pictures/pwbc8wwrrjpafoflen52');

