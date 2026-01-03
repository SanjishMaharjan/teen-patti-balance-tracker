export const Button = ({ children, onClick, variant = "primary", className = "", disabled = false }: any) => {
  const base = "px-4 py-2 rounded font-medium transition-colors";
  const styles = {
    primary: "bg-emerald-600 text-white hover:bg-emerald-700 disabled:bg-slate-600",
    outline: "border border-slate-600 text-slate-300 hover:bg-slate-800",
    danger: "bg-red-600 text-white hover:bg-red-700",
    secondary: "bg-slate-700 text-white hover:bg-slate-600"
  };
  return (
    <button 
      disabled={disabled}
      onClick={onClick} 
      className={`${base} ${styles[variant as keyof typeof styles]} ${className}`}
    >
      {children}
    </button>
  );
};
