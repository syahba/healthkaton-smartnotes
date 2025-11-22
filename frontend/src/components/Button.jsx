function Button({ text, onClick }) {
  return (
    <button onClick={onClick} className="text-white bg-[var(--primary)] rounded-2xl shadow-2xl">
      {text}
    </button>
  );
}

export default Button;