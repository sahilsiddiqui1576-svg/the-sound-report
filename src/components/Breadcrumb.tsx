import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function Breadcrumb({ items }: { items: { href?: string; label: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1 text-sm text-neutral-500 dark:text-neutral-400">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1">
          {item.href ? (
            <Link href={item.href} className="hover:text-accent">
              {item.label}
            </Link>
          ) : (
            <span aria-current="page" className="text-neutral-700 dark:text-neutral-200">
              {item.label}
            </span>
          )}
          {i < items.length - 1 && <ChevronRight size={14} aria-hidden />}
        </span>
      ))}
    </nav>
  );
}
