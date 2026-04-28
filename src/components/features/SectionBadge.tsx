interface SectionBadgeProps {
  children: React.ReactNode;
  className?: string;
}

export default function SectionBadge({ children, className = '' }: SectionBadgeProps) {
  return (
    <div className={`inline-flex items-center gap-2 px-6 py-2 rounded-full text-sm font-bold bg-[#1c4b42]/5 text-[#1c4b42] border border-[#1c4b42]/10 shadow-sm ${className}`}>
      <div className="w-2 h-2 rounded-full bg-[#b4e717] animate-pulse shadow-[0_0_8px_#b4e717]" />
      {children}
    </div>
  );
}
