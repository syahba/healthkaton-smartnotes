function Button({ text, onClick, isSmall = false }) {
  return (
    <button onClick={onClick} className={`text-white bg-[var(--primary)] shadow-2xl ${isSmall ? 'rounded-lg py-1.5 px-4' : 'rounded-xl py-2.5 px-6'} cursor-pointer hover:scale-105 transition-all duration-300`}>
      {text}
    </button>
  );
}

export default Button;