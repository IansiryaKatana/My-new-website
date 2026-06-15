import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";
import type { ReactNode } from "react";

import styles from "../styles.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Wierd Try - Premium Portfolio Studio",
      },
      {
        name: "description",
        content:
          "A premium creative developer portfolio for purposeful websites, brand systems, and polished digital experiences.",
      },
      {
        property: "og:title",
        content: "Wierd Try - Premium Portfolio Studio",
      },
      {
        property: "og:description",
        content:
          "Editorial portfolio landing page for a creative web designer and developer.",
      },
      {
        property: "og:type",
        content: "website",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: styles,
      },
      {
        rel: "preconnect",
        href: "https://images.unsplash.com",
      },
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

function RootDocument({ children }: { children: ReactNode }) {
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
