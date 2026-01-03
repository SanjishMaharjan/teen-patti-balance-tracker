export const Badge = ({ children, className = "" }: any) => (
  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${className}`}>
    {children}
  </span>
);
