import { json } from "@remix-run/node";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
export const meta: MetaFunction = () => {
  return [
    { title: "Example" },
    { name: "description", content: "Welcome to Example!" },
  ];
};
let num = 1;
export const loader = async ({ params }: LoaderFunctionArgs) => {
  const message = num++;
  return json({ message });
};

export default function Message() {
  const { message } = useLoaderData<typeof loader>();

  return (
    <div className="font-sans p-4 bg-red">
      {message} <Outlet />
    </div>
  );
}
