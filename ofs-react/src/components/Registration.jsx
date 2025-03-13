import Form from "./Form";

const formElements = [
  { tag: "firstName", text: "First Name" },
  { tag: "lastName", text: "Last Name" },
  { tag: "userName", text: "Username" },
];

export default function Registration() {
  return (
    <div className="flex justify-center">
      <Form formElements={formElements} submit="Register" pw="true" />
    </div>
  );
}
