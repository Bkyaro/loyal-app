import { redirect } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";

export async function loader({ request, params }: LoaderFunctionArgs) {
  // 基于 app.program.tsx 中的 ActionsPage 组件，让它处理渲染
  // 这里只需返回一个空对象，告诉 Remix 这是一个有效路由
  return {};
}

export default function ProgramActions() {
  // 内容在 app.program.tsx 中的 ActionsPage 组件中渲染
  return <h1>ways to earn</h1>;
}
