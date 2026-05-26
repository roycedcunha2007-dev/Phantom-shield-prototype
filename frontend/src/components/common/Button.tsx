import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  children: ReactNode;
}

// Reusable button primitive for the existing visual system.
export function Button({ variant = "secondary", children, className = "", ...props }: ButtonProps) {
  return (
    <button className={`${variant === "primary" ? "primary-btn" : "secondary-btn"} ${className}`.trim()} {...props}>
      {children}
    </button>
  );
}
