"use client";

import { Fragment, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MORE_GROUPS, MORE_ROUTES, NAV_CONTACT, NAV_GROUPS } from "@/data/site";

/**
 * Main navigation in three labelled groups (Explore, Apply, Help), separated
 * by a thin hairline spacer, then a "More" menu and Contact as a button at the
 * end. The links are plain anchors; on small screens each group wraps onto a
 * new line as a unit. The current page is marked with aria-current="page"; on
 * an idea page, "Ideas" is marked as the current section.
 *
 * "More" is a native <details> element, so it opens and closes without
 * JavaScript. It lists every page that is not in the main navigation
 * (MORE_GROUPS in src/data/site.ts). With JavaScript, it also closes on
 * Escape, on a click outside it and when the route changes.
 */
export function MainNav() {
  const pathname = usePathname() ?? "/";
  const path = pathname.endsWith("/") ? pathname : `${pathname}/`;
  const current = (href: string) => (path === href ? "page" : path.startsWith(href) ? "true" : undefined);
  const moreCurrent = MORE_ROUTES.includes(path);
  const more = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    if (more.current) more.current.open = false;
  }, [path]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const details = more.current;
      if (event.key !== "Escape" || !details?.open) return;
      details.open = false;
      details.querySelector("summary")?.focus();
    };
    const onPointer = (event: PointerEvent) => {
      const details = more.current;
      if (details?.open && event.target instanceof Node && !details.contains(event.target)) details.open = false;
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, []);

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
            </ul>
          </Fragment>
        ))}
        <span className="nav-spacer" aria-hidden="true" />
        <ul aria-label="More and contact" className="nav-end">
          <li className="nav-more-item">
            <details ref={more} className="nav-more">
              <summary aria-label="More pages" data-current={moreCurrent ? "true" : undefined}>
                <span className="nav-more-icon" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </span>
                <span>More</span>
              </summary>
              <div className="nav-more-panel">
                {MORE_GROUPS.map((group, index) => (
                  <div className="nav-more-group" key={group.label}>
                    <p className="nav-more-heading" id={`nav-more-${index}`}>
                      {group.label}
                    </p>
                    <ul aria-labelledby={`nav-more-${index}`}>
                      {group.items.map((item) => (
                        <li key={item.href}>
                          <Link href={item.href} aria-current={path === item.href ? "page" : undefined}>
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </details>
          </li>
          <li className="nav-contact">
            <Link href={NAV_CONTACT.href} aria-current={current(NAV_CONTACT.href)}>
              {NAV_CONTACT.label}
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
