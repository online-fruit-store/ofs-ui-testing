export default function FormFieldText({ tag, text, type = "text" }) {
  return (
    <div className="flex flex-col">
      <label for={tag}>{text} </label>
      <input type={type} for={tag} className="bg-white"></input>
    </div>
  );
}
