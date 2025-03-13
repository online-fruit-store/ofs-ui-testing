import Form from "./Form";
const formElements = [{ tag: "username", text: "Username" }];
export default function Login() {
  return (
    <div className="flex justify-center">
      <Form formElements={formElements} submit="Login" pw="true" />
    </div>
  );
}
