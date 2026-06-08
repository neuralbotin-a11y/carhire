// Button.tsx — Shared button component. Always use this, never create ad-hoc buttons.

type ButtonProps = {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: "primary" | "outline" | "ghost";
    type?: "button" | "submit" | "reset";
    className?: string;
    disabled?: boolean;
  };
  
  export default function Button({
    children,
    onClick,
    variant = "primary",
    type = "button",
    className = "",
    disabled = false,
  }: ButtonProps) {
    const base = "font-semibold text-sm px-6 py-3 rounded-full transition-all duration-200 disabled:opacity-50 cursor-pointer";
  
    const variants = {
      primary: "bg-brand-navy text-white hover:bg-brand-navyLight",
      outline: "border-2 border-brand-navy text-brand-navy hover:bg-brand-navy hover:text-white",
      ghost:   "text-brand-navy hover:text-brand-navyLight underline underline-offset-2",
    };
  
    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`${base} ${variants[variant]} ${className}`}
      >
        {children}
      </button>
    );
  }