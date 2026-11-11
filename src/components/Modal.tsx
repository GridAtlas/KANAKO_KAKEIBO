"use client";

import { useEffect, useRef, type KeyboardEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";

const focusable = 'button:not([disabled]), a[href]';
let openModalCount = 0;
let previousOverflow = "";

export function Modal({
  labelledBy,
  describedBy,
  onClose,
  className,
  children,
}: {
  labelledBy: string;
  describedBy?: string;
  onClose: () => void;
  className: string;
  children: ReactNode;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    const previousFocus = document.activeElement;
    if (openModalCount === 0) {
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    }
    openModalCount++;
    (panel.querySelector<HTMLElement>(focusable) ?? panel).focus();

    return () => {
      openModalCount--;
      if (openModalCount === 0) document.body.style.overflow = previousOverflow;

      const activeElement = document.activeElement;
      if (
        (activeElement === document.body || panel.contains(activeElement)) &&
        previousFocus instanceof HTMLElement && previousFocus.isConnected
      ) {
        previousFocus.focus();
      }
    };
  }, []);

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      onClose();
      return;
    }
    if (event.key !== "Tab") return;

    event.preventDefault();
    const controls = Array.from(event.currentTarget.querySelectorAll<HTMLElement>(focusable));
    if (controls.length === 0) return;

    const index = controls.findIndex((control) => control === document.activeElement);
    const nextIndex = event.shiftKey
      ? (index <= 0 ? controls.length - 1 : index - 1)
      : (index + 1) % controls.length;
    controls[nextIndex]?.focus();
  }

  if (typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed bottom-0 left-0 right-0 top-0 z-[60] flex items-center justify-center bg-[rgba(64,38,45,0.45)] px-3 py-4">
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        className={`max-h-full w-full max-w-sm overflow-y-auto overscroll-contain border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] shadow-xl ${className}`}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}
