import * as React from "react";

/** Omit aria-* from Radix content so primitives auto-link Title/Description children. */
export const OMIT_ARIA = Symbol("omit-aria");

export function childrenIncludeElement(
  nodes: React.ReactNode,
  match: (el: React.ReactElement) => boolean,
  maxDepth = 4,
  depth = 0,
): boolean {
  let found = false;
  React.Children.forEach(nodes, (child) => {
    if (found) return;
    if (!React.isValidElement(child)) return;
    if (match(child)) {
      found = true;
      return;
    }
    if (depth < maxDepth && child.props && typeof child.props === "object" && "children" in child.props) {
      found = childrenIncludeElement(child.props.children as React.ReactNode, match, maxDepth, depth + 1);
    }
  });
  return found;
}

export function resolveAriaDescribedBy(
  children: React.ReactNode,
  explicit: string | undefined,
  hasDescription: boolean,
): string | undefined | typeof OMIT_ARIA {
  if (explicit !== undefined) return explicit;
  if (hasDescription) return OMIT_ARIA;
  return undefined;
}

export function resolveAriaLabelledBy(
  children: React.ReactNode,
  explicit: string | undefined,
  hasTitle: boolean,
): string | undefined | typeof OMIT_ARIA {
  if (explicit !== undefined) return explicit;
  if (hasTitle) return OMIT_ARIA;
  return undefined;
}

export function applyAriaProp(
  resolved: string | undefined | typeof OMIT_ARIA,
  prop: "aria-describedby" | "aria-labelledby",
): Record<string, string | undefined> {
  if (resolved === OMIT_ARIA) return {};
  return { [prop]: resolved };
}
