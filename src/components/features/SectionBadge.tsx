interface SectionBadgeProps {
  children: React.ReactNode;
  className?: string;
}

export default function SectionBadge({ children, className = '' }: SectionBadgeProps) {
  return (
    <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium bg-brand-green/10 text-brand-green border border-brand-green/20 ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-brand-gold" />
      {children}
    </span>
  );
}
