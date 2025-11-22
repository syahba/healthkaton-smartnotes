function Button({ text, onClick }) {
  return (
    <button onClick={onClick} className="text-white bg-[var(--primary)] rounded-xl shadow-2xl py-3 px-6 cursor-pointer hover:scale-105 transition-all duration-300">
      {text}
    </button>
  );
}

export default Button;