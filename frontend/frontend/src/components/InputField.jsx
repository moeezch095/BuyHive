function InputField({ label, placeholder, type = "text" }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        className="border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-teal-400"
      />
    </div>
  );
}

export default InputField;
