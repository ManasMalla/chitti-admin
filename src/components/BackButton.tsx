"use client";
import { useRouter } from "next/navigation";
import "tailwindcss/index.css";

interface BackButtonProps {
  href?: string;
  children?: React.ReactNode;
}

export function BackButton({ href, children }: BackButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    if (href) {
      router.push(href);
    } else {
      router.back();
    }
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-1 p-2 text-sm transition-colors duration-200 cursor-pointer hover:opacity-80 cursor-pointer"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        color: 'var(--text-primary)',
        border: '1px solid var(--border-color)',
        borderRadius: '6px',
      }}
      aria-label="Go back"
    >
      <span className="material-symbols-outlined">
        arrow_back
      </span>
      {children || "Back"}
    </button>
  );
}
