SET TIME ZONE 'UTC';

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


CREATE TABLE userspace (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'customer',
  cart JSONB DEFAULT '[]'::jsonb
);


CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,
  transaction_id VARCHAR(255) UNIQUE NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  last4 VARCHAR(4) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER,
  status VARCHAR(50) DEFAULT 'pending',
  total DECIMAL(10, 2) NOT NULL,
  shipping_address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER,
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL
);



CREATE TABLE products (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name character varying(255),
    price numeric(10, 2),
    weight numeric(6, 2),
    category character varying(255),
    stock integer,
    img_url character varying(255),
    description character varying (1023)
);

INSERT INTO userspace (first_name, last_name, email, password, role)
VALUES
('Ivan', 'Gomez', 'igomez9898@gmail.com', 'pass', 'admin');

INSERT INTO products (name, price, weight, category, stock, img_url, description)
VALUES
('apple', 0.66, 0.5, 'fruit', 85, 'https://res.cloudinary.com/dezsecf8p/image/upload/f_auto,q_auto/v1/Backend%20Pictures/g3efmooigjjmfh0c5gby', 'Crisp and sweet red apple.'),
('banana', 0.63, 0.3, 'fruit', 94, 'https://res.cloudinary.com/dezsecf8p/image/upload/f_auto,q_auto/v1/Backend%20Pictures/vxhy927yhdufovssspqu', 'Fresh yellow banana, rich in potassium.'),
('orange', 0.51, 0.4, 'fruit', 51, 'https://res.cloudinary.com/dezsecf8p/image/upload/f_auto,q_auto/v1/Backend%20Pictures/j37shkjjza3vuympome9', 'Juicy orange packed with vitamin C.'),
('pineapple', 0.73, 1.0, 'fruit', 97, 'https://res.cloudinary.com/dezsecf8p/image/upload/f_auto,q_auto/v1/Backend%20Pictures/a8fhbdqubjuxfmzpmrva', 'Tropical pineapple with a tangy flavor.'),
('watermelon', 0.10, 3.5, 'fruit', 50, 'https://res.cloudinary.com/dezsecf8p/image/upload/f_auto,q_auto/v1/Backend%20Pictures/n1fkjcujnwjkmau9sj0o', 'Large, juicy watermelon perfect for summer.'),
('cantaloupe', 0.15, 2.5, 'fruit', 36, 'https://res.cloudinary.com/dezsecf8p/image/upload/f_auto,q_auto/v1/Backend%20Pictures/r8jg63y0bwdriwswl9po', 'Sweet cantaloupe with orange flesh.'),
('kiwi', 0.71, 0.2, 'fruit', 60, 'https://res.cloudinary.com/dezsecf8p/image/upload/f_auto,q_auto/v1/Backend%20Pictures/tb1erz38rk5z234ls5id', 'Small kiwi with tart green flesh.'),
('lettuce', 0.15, 1.0, 'vegetable', 60, 'https://res.cloudinary.com/dezsecf8p/image/upload/f_auto,q_auto/v1/Backend%20Pictures/yfpnxjxgi2jzigbejiad', 'Fresh green lettuce leaves.'),
('tomato', 0.37, 0.4, 'vegetable', 0, 'https://res.cloudinary.com/dezsecf8p/image/upload/f_auto,q_auto/v1/Backend%20Pictures/d1650mpjbdhpf4dmqxu0', 'Juicy red tomato, great for salads.'),
('celery', 0.63, 1.2, 'vegetable', 41, 'https://res.cloudinary.com/dezsecf8p/image/upload/f_auto,q_auto/v1/Backend%20Pictures/y5ssnuv2yzgt73ygw3ar', 'Crunchy celery sticks, low in calories.'),
('onion', 0.51, 0.5, 'vegetable', 42, 'https://res.cloudinary.com/dezsecf8p/image/upload/f_auto,q_auto/v1/Backend%20Pictures/qusprabrxivinpasuslh', 'Sharp and flavorful yellow onion.'),
('potato', 0.04, 0.6, 'vegetable', 39, 'https://res.cloudinary.com/dezsecf8p/image/upload/f_auto,q_auto/v1/Backend%20Pictures/ea9oyinehtowadgxuk5i', 'Versatile starchy potato.'),
('beef', 0.88, 1.0, 'meat', 96, 'https://res.cloudinary.com/dezsecf8p/image/upload/f_auto,q_auto/v1/Backend%20Pictures/wm7nqbt4vssavp2ede0q', 'High-protein ground beef.'),
('chicken', 0.92, 1.5, 'meat', 90, 'https://res.cloudinary.com/dezsecf8p/image/upload/f_auto,q_auto/v1/Backend%20Pictures/g8i2driimdyzrtmtdysd', 'Lean chicken breast meat.'),
('fish', 0.65, 1.2, 'meat', 82, 'https://res.cloudinary.com/dezsecf8p/image/upload/f_auto,q_auto/v1/Backend%20Pictures/qd5lqdjhxr9y7gniibeh', 'Fresh white fish fillet.'),
('pasta', 0.84, 1.0, 'grains', 77, 'https://res.cloudinary.com/dezsecf8p/image/upload/f_auto,q_auto/v1/Backend%20Pictures/lyephxtoj1has6n2ntyz', 'Classic dry pasta made from durum wheat.'),
('rice', 0.04, 1.0, 'grains', 88, 'https://res.cloudinary.com/dezsecf8p/image/upload/f_auto,q_auto/v1/Backend%20Pictures/ciwfhsmwsx7bpfv5foyv', 'Long grain white rice.'),
('milk', 0.66, 2.2, 'dairy', 19, 'https://res.cloudinary.com/dezsecf8p/image/upload/f_auto,q_auto/v1/Backend%20Pictures/fqqi4iqizufbfmgv1jsq', 'Whole milk, rich in calcium.'),
('cheese', 0.99, 0.8, 'dairy', 33, 'https://res.cloudinary.com/dezsecf8p/image/upload/f_auto,q_auto/v1/Backend%20Pictures/ia0gepzw3iuclty72s8i', 'Aged cheddar cheese block.'),
('ham', 0.99, 0.7, 'deli', 73, 'https://res.cloudinary.com/dezsecf8p/image/upload/f_auto,q_auto/v1/Backend%20Pictures/pwbc8wwrrjpafoflen52', 'Sliced deli ham, perfect for sandwiches.');

