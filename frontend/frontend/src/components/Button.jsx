function Button({ text, type = "button" }) {
  return (
    <button
      type={type}
      className="bg-teal-500 text-white px-6 py-2 rounded-full hover:bg-teal-600 transition"
    >
      {text}
    </button>
  );
}

export default Button;
