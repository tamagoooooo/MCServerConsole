import Link from "next/link";

interface MenuItemProps {
  icon: string;
  label: string;
  active?: boolean;
  href:string;
}

export function MenuItem({ icon, label, active = false, href }: MenuItemProps) {
  if (active) {
    return (
      <div className="flex items-center gap-3 py-[10px] px-4 w-full bg-[var(--surface)] cursor-pointer">
        <div className="w-[3px] self-stretch bg-[var(--accent)]" />
        <span className="icon text-[20px] text-[var(--accent)]">{icon}</span>
        <span className="font-primary text-sm font-medium text-[var(--foreground)]">
          {label}
        </span>
      </div>
    );
  }

  return (
    <Link href={href} className="flex items-center gap-3 py-[10px] px-4 w-full cursor-pointer">
      <span className="icon text-[20px] text-[var(--muted-foreground)]">
        {icon}
      </span>
      <span className="font-primary text-sm font-normal text-[var(--muted-foreground)]">
        {label}
      </span>
    </Link>
  );
}
