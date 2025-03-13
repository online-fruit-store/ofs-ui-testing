import FormFieldText from "./FormFieldText";

export default function Form({ formElements, submit, pw = false }) {
  return (
    <>
      <form className="flex justify-center flex-col gap-3">
        {formElements.map((e) => {
          return <FormFieldText tag={e.tag} text={e.text} />;
        })}
        {pw ? (
          <FormFieldText tag="password" text="Password" type="password" />
        ) : null}
        <button
          className="border-2 border-black font-semibold text-xl bg-cyan-500 text-white rounded-md"
          type="submit"
        >
          {submit}
        </button>
      </form>
    </>
  );
}
