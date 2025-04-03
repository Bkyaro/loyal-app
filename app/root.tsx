import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRouteError,
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

export function ErrorBoundary() {
  const error = useRouteError();
  console.error(error);

  let errorMessage = "发生了未知错误";
  let errorDetails = "";

  // 处理不同类型的错误
  if (error instanceof Error) {
    errorMessage = error.message;
    errorDetails = error.stack || "";
  } else if (typeof error === "object" && error !== null) {
    errorMessage = JSON.stringify(error);
  }

  return (
    <html>
      <head>
        <title>出错了！</title>
        <Meta />
        <Links />
      </head>
      <body>
        <div className='p-8 max-w-4xl mx-auto font-sans'>
          <h1 className='text-red-600 text-3xl mb-4'>出错了！</h1>

          <div className='bg-red-50 p-4 rounded-lg border border-red-200'>
            <p className='text-red-800 font-bold mb-2'>错误信息：</p>
            <p className='text-gray-800 mb-4'>{errorMessage}</p>

            {errorDetails && (
              <>
                <p className='text-red-800 font-bold mb-2'>错误详情：</p>
                <pre className='bg-white p-4 rounded overflow-auto text-sm leading-relaxed'>
                  {errorDetails}
                </pre>
              </>
            )}
          </div>

          <div className='mt-8 text-center'>
            <button
              onClick={() => window.location.reload()}
              className='bg-blue-600 text-white py-2 px-4 rounded border-none cursor-pointer hover:bg-blue-700'
            >
              刷新页面
            </button>
          </div>
        </div>
        <Scripts />
      </body>
    </html>
  );
}
