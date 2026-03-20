export default function PrimaryButton({ children, disabled = false, ...props }) {
  return (
    <button
      {...props}
      disabled={disabled}
      className="w-full rounded-xl bg-slate-200 px-4 py-3 font-semibold text-slate-950 shadow-lg transition hover:bg-slate-100 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {children}
    </button>
  )
}
