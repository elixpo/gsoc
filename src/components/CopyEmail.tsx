"use client";

import { useEffect, useState } from "react";

/**
 * A mailto link with a copy button. The server renders only the link; the
 * button is added after hydration, and only when the Clipboard API exists, so
 * without JavaScript the reader sees a working link and nothing broken.
 */
export function CopyEmail({ email, className }: { email: string; className?: string }) {
  const [canCopy, setCanCopy] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    // Feature detection has to run in the browser, after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCanCopy(typeof navigator !== "undefined" && Boolean(navigator.clipboard?.writeText));
  }, []);

  useEffect(() => {
    if (!status) return;
    const timer = window.setTimeout(() => setStatus(""), 2500);
    return () => window.clearTimeout(timer);
  }, [status]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setStatus("Copied");
    } catch {
      setStatus("Copy failed; select the address instead");
    }
  }

  return (
    <span className={["copy-email", className].filter(Boolean).join(" ")}>
      <a className="copy-email-link" href={`mailto:${email}`}>
        {email}
      </a>
      {canCopy ? (
        <button type="button" className="copy-email-button" onClick={copy} aria-label={`Copy ${email} to the clipboard`}>
          {status === "Copied" ? "Copied" : "Copy"}
        </button>
      ) : null}
      <span className="visually-hidden" aria-live="polite">
        {status ? `${status}: ${email}` : ""}
      </span>
    </span>
  );
}
