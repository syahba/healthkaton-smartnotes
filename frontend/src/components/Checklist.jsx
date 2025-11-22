function Checklist() {
  return (
    <div className="flex items-center bg-white rounded-xl shadow-lg py-3.5 px-5 gap-4">
      <input type="checkbox" name="task" value={0} className="w-7 h-7 cursor-pointer" />
      <label htmlFor="task" className="paragraph text-[var(--neutral)] leading-5.5">Buka menu pendaftaran pada aplikasi atau website BPJS</label>
    </div>
  );
}

export default Checklist;