import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { LinksFunction, MetaFunction } from "@remix-run/node";
import styles from "~/styles/tailwind.css?url";
import "swiper/css";
import "swiper/css/navigation";
import "~/styles/swiper-custom.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
  {
    rel: "preload",
    href: "https://cdn.shopify.com/shopifycloud/app-bridge.js",
  },
];

export const meta: MetaFunction = () => [
  {
    name: "shopify-api-key",
    content: "width=device-width,initial-scale=1",
  },
];

export default function App() {
  return (
    <html>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width,initial-scale=1' />
        <link rel='preconnect' href='https://cdn.shopify.com/' />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
