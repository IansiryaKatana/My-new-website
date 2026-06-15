/// <reference types="vite/client" />

import type { ReactNode } from "react";
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";
import "../styles.css";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Mar-Health | Premium Wellbeing Platform",
      },
      {
        name: "description",
        content:
          "A premium health-tech landing page for medical programs, consultations, wellbeing support, and trusted care access.",
      },
    ],
    links: [
      { rel: "preconnect", href: "https://images.unsplash.com" },
      { rel: "preconnect", href: "https://images.unsplash.com", crossOrigin: "anonymous" },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
