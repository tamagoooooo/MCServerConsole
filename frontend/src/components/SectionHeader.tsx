interface SectionHeaderProps {
  label: string;
}

export function SectionHeader({ label }: SectionHeaderProps) {
  return (
    <div className="pt-4 px-4 pb-2">
      <span className="font-secondary text-[11px] font-medium tracking-[1px] text-[var(--text-muted)]">
        {label}
      </span>
    </div>
  );
}
