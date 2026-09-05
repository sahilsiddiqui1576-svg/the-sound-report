interface Props {
  label: string;
  changeLabel?: string;
  icon?: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}

export default function GenreChip({ label, changeLabel, icon, active, onClick }: Props) {
  const Comp: React.ElementType = onClick ? "button" : "div";
  return (
    <Comp
      onClick={onClick}
      type={onClick ? "button" : undefined}
      aria-pressed={onClick ? active : undefined}
      className={`flex shrink-0 items-center gap-2 rounded-xl border px-4 py-3 text-sm transition
                  ${active
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-black/10 hover:border-accent/50 dark:border-white/10"}`}
    >
      {icon}
      <span className="font-medium">{label}</span>
      {changeLabel && <span className="text-xs text-emerald-500">{changeLabel}</span>}
    </Comp>
  );
}
