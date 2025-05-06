export default function AddToCart() {
  return (
    <form
      className="flex flex-col items-center justify-center gap-1"
      action={addToCart}
    >
      <button
        type="submit"
        className="border-2 border-none px-2 py-1 bg-blue-800 text-white text-sm rounded-lg border-blue-100 cursor-pointer hover:bg-blue-900
            transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110"
      >
        Add to Cart
      </button>
    </form>
  );
}
