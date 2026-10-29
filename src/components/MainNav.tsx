"use client";

import { Fragment } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_CONTACT, NAV_GROUPS } from "@/data/site";

/**
 * Main navigation in three labelled groups (Explore, Apply, Help), separated
 * by a thin hairline spacer, with Contact as a button at the end. The links
 * are plain anchors; on small screens each group wraps onto a new line as a
 * unit, so the menu works without JavaScript. The current page is marked
 * with aria-current="page"; on an idea page, "Ideas" is marked as the current
 * section.
 */
export function MainNav() {
  const pathname = usePathname() ?? "/";
  const path = pathname.endsWith("/") ? pathname : `${pathname}/`;
  const current = (href: string) => (path === href ? "page" : path.startsWith(href) ? "true" : undefined);
  const last = NAV_GROUPS.length - 1;
  return (
    <nav aria-label="Main" className="main-nav">
      <div className="nav-groups">
        {NAV_GROUPS.map((group, index) => (
          <Fragment key={group.label}>
            {index > 0 && <span className="nav-spacer" aria-hidden="true" />}
            <ul aria-label={group.label}>
              {group.items.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} aria-current={current(item.href)}>
                    {item.label}
                  </Link>
                </li>
              ))}
              {index === last && (
                <li className="nav-contact">
                  <Link href={NAV_CONTACT.href} aria-current={current(NAV_CONTACT.href)}>
                    {NAV_CONTACT.label}
                  </Link>
                </li>
              )}
            </ul>
          </Fragment>
        ))}
      </div>
    </nav>
  );
}
