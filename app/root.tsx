import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { MuiMeta } from "./mui/MuiMeta";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import { getMuiLinks } from "./mui/getMuiLinks";
import { createClient } from "@supabase/supabase-js";
import SupabaseClientContext from "./supabase/SupabaseClientContext";
import { useMemo } from "react";

export const links: LinksFunction = () => [...getMuiLinks()];

export async function loader({}: LoaderFunctionArgs) {
  return {
    env: {
      SUPABASE_URL: process.env.PUBLIC_SUPABASE_URL!,
      SUPABASE_ANON_KEY: process.env.PUBLIC_SUPABASE_ANON_KEY!,
    },
  };
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <MuiMeta />
        <Links />
      </head>
      <body>
        <div id="root">{children}</div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const { env } = useLoaderData<typeof loader>();

  const supabaseClient = useMemo(
    () => createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY),
    []
  );

  return (
    <SupabaseClientContext.Provider value={supabaseClient}>
      <Outlet />
    </SupabaseClientContext.Provider>
  );
}
