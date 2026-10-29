"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV } from "@/data/site";

/**
 * Main navigation. The links are plain anchors that wrap onto extra lines on
 * small screens, so the menu works without JavaScript. The current page is
 * marked with aria-current="page"; on an idea page, "Ideas" is marked as the
 * current section.
 */
export function MainNav() {
  const pathname = usePathname() ?? "/";
  const path = pathname.endsWith("/") ? pathname : `${pathname}/`;
  return (
    <nav aria-label="Main" className="main-nav">
      <ul>
        {NAV.map((item) => {
          const current = path === item.href ? "page" : path.startsWith(item.href) ? "true" : undefined;
          return (
            <li key={item.href}>
              <Link href={item.href} aria-current={current}>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
