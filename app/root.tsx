import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import {
  json,
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import styles from "~/styles/tailwind.css?url";
import "swiper/css";
import "swiper/css/navigation";
import "~/styles/swiper-custom.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
  // App-bridge:  https://shopify.dev/docs/api/app-bridge-library/react-hooks/useappbridge
  {
    rel: "preload",
    href: "https://cdn.shopify.com/shopifycloud/app-bridge.js",
  },
];

// https://shopify.dev/docs/api/app-bridge-library#getting-started
// 此处异常的meta值会导致graphql请求异常（触发相关请求方法后没有发送请求），先注释掉，通过loader获取正确的meta值
// export const meta: MetaFunction = () => [
//   {
//     name: "shopify-api-key",
//     content: "",
//   },
// ];

// 获取apikey
export const loader: LoaderFunction = async () => {
  return {
    apiKey: process.env.SHOPIFY_API_KEY || "",
  };
};

export default function App() {
  const { apiKey } = useLoaderData<typeof loader>();
  return (
    <html>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width,initial-scale=1' />
        <meta name='shopify-api-key' content={apiKey} />
        <Meta />
        <link rel='preconnect' href='https://cdn.shopify.com/' />
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
