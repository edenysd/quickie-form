import { json } from "@remix-run/node";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData, useLocation, useNavigate } from "@remix-run/react";
export const meta: MetaFunction = () => {
  return [
    { title: "Example" },
    { name: "description", content: "Welcome to Example!" },
  ];
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const message = params.message;
  return json({ message });
};

export default function Message() {
  const { message } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  return (
    <div className="font-sans p-4">
      {message}
      <button onClick={() => navigate(`/example/${(message || "") + "1"}`)}>
        add +1
      </button>
    </div>
  );
}
