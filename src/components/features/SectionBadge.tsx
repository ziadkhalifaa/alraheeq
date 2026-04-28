interface SectionBadgeProps {
  children: React.ReactNode;
  className?: string;
}

export default function SectionBadge({ children, className = '' }: SectionBadgeProps) {
  return (
    <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-lg text-[11px] font-bold bg-[#1c4b42]/5 text-[#1c4b42] border border-[#1c4b42]/10 ${className}`}>
      <div className="w-1.5 h-1.5 rounded-full bg-[#b4e717] shadow-[0_0_8px_#b4e717]" />
      {children}
    </div>
  );
}
