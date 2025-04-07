import { LoaderFunctionArgs } from "@remix-run/node";

export async function loader({ request, params }: LoaderFunctionArgs) {
  return {};
}

export default function ProgramVIP() {
  // 内容在 app.program.tsx 中通过renderContent函数渲染
  return null;
} 