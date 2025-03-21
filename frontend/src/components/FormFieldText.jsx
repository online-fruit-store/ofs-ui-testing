export default function FormFieldText({ tag, text, type = "text" }) {
  return (
    <div className="flex flex-col">
      <label htmlFor={tag}>
        {text}
        <input type={type} htmlFor={tag} className="bg-white"></input>{" "}
      </label>
    </div>
  );
}
