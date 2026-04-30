"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
  type RefObject,
} from "react";

/**
 * Outside-click → collapse-deepest behaviour for nested expandable rows.
 *
 * Each expandable row (year, semester, bucket, department) registers its
 * element + open state + close callback with the provider. A document-level
 * mousedown listener inspects every click:
 *   1. If it lands inside ANY registered row's element, do nothing — that
 *      includes clicking another (not-currently-open) row, which is the
 *      "A3" rule: clicks on rows are always neutral.
 *   2. If it lands inside a portal'd surface (dialog, menu, tooltip, or
 *      anything tagged `data-no-row-collapse`), do nothing.
 *   3. Otherwise, pop the deepest currently-open row (LIFO within the
 *      max-depth tier). That's the "B1" rule: each outside click peels one
 *      level off the stack.
 */

type Entry = {
  id: number;
  depth: number;
  ref: RefObject<HTMLElement | null>;
  isOpenRef: { current: boolean };
  close: () => void;
};

const NO_COLLAPSE_SELECTORS = [
  "[data-slot=dialog-content]",
  "[data-slot=dialog-overlay]",
  "[data-slot=select-content]",
  "[role=dialog]",
  "[role=menu]",
  "[role=tooltip]",
  "[data-no-row-collapse]",
] as const;

let nextId = 1;

const Ctx = createContext<{
  register: (e: Entry) => () => void;
} | null>(null);

export function CollapseStackProvider({ children }: { children: ReactNode }) {
  const stack = useRef<Entry[]>([]);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      const target = e.target as Element | null;
      if (!target) return;

      // Floating surfaces never trigger collapse.
      for (const sel of NO_COLLAPSE_SELECTORS) {
        if (target.closest(sel)) return;
      }

      // Click inside ANY known row (open or closed) is neutral.
      const insideAnyRow = stack.current.some((en) =>
        en.ref.current?.contains(target),
      );
      if (insideAnyRow) return;

      // Otherwise: pop the deepest open row.
      const opens = stack.current.filter((en) => en.isOpenRef.current);
      if (opens.length === 0) return;
      let maxDepth = -Infinity;
      for (const en of opens) if (en.depth > maxDepth) maxDepth = en.depth;
      // LIFO within the deepest tier.
      let chosen: Entry | null = null;
      for (let i = opens.length - 1; i >= 0; i--) {
        if (opens[i].depth === maxDepth) {
          chosen = opens[i];
          break;
        }
      }
      chosen?.close();
    };
    document.addEventListener("mousedown", onDown, true);
    return () => document.removeEventListener("mousedown", onDown, true);
  }, []);

  return (
    <Ctx.Provider
      value={{
        register: (entry) => {
          stack.current.push(entry);
          return () => {
            stack.current = stack.current.filter((e) => e.id !== entry.id);
          };
        },
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

/**
 * Register an expandable row with the surrounding `CollapseStackProvider`.
 * Outside the provider, this is a no-op so callers can use it freely.
 */
export function useCollapseRow(
  depth: number,
  elementRef: RefObject<HTMLElement | null>,
  isOpen: boolean,
  onClose: () => void,
) {
  const ctx = useContext(Ctx);
  const isOpenRef = useRef(isOpen);
  const closeRef = useRef(onClose);
  isOpenRef.current = isOpen;
  closeRef.current = onClose;

  useEffect(() => {
    if (!ctx) return;
    const id = nextId++;
    return ctx.register({
      id,
      depth,
      ref: elementRef,
      isOpenRef,
      close: () => closeRef.current(),
    });
  }, [ctx, depth, elementRef]);
}
