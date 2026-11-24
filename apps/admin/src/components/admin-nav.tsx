"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GROUPS, MODULES } from "@/lib/modules";

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Modules du back-office">
      {GROUPS.map((group) => (
        <div key={group} className="navGroup">
          <p>{group}</p>
          <ul role="list">
            {MODULES.filter((m) => m.group === group).map((m) => {
              const href = m.slug === "dashboard" ? "/" : `/${m.slug}`;
              return (
                <li key={m.slug}>
                  <Link href={href} aria-current={pathname === href ? "page" : undefined}>
                    {m.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
