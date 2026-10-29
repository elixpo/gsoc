"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV, NAV_CONTACT } from "@/data/site";

/**
 * Main navigation, in order of importance, with Contact as a button at the
 * end. The links are plain anchors that wrap onto extra lines on small
 * screens, so the menu works without JavaScript. The current page is marked
 * with aria-current="page"; on an idea page, "Ideas" is marked as the current
 * section.
 */
export function MainNav() {
  const pathname = usePathname() ?? "/";
  const path = pathname.endsWith("/") ? pathname : `${pathname}/`;
  const current = (href: string) => (path === href ? "page" : path.startsWith(href) ? "true" : undefined);
  return (
    <nav aria-label="Main" className="main-nav">
      <ul>
        {NAV.map((item) => (
          <li key={item.href}>
            <Link href={item.href} aria-current={current(item.href)}>
              {item.label}
            </Link>
          </li>
        ))}
        <li className="nav-contact">
          <Link href={NAV_CONTACT.href} aria-current={current(NAV_CONTACT.href)}>
            {NAV_CONTACT.label}
          </Link>
        </li>
      </ul>
    </nav>
  );
}
