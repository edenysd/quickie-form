import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { MuiMeta } from "./mui/MuiMeta";
import type { LinksFunction } from "@vercel/remix";
import { getMuiLinks } from "./mui/getMuiLinks";
import { Analytics } from "@vercel/analytics/react";
import { createBrowserClient } from "@supabase/ssr";
import SupabaseBrowserClientContext from "./supabase/SupabaseBrowserClientContext";
import { useMemo } from "react";
import { closeSnackbar, SnackbarProvider } from "notistack";
import { IconButton } from "@mui/material";
import { CloseRounded } from "@mui/icons-material";

export const links: LinksFunction = () => [...getMuiLinks()];

export async function loader() {
  return {
    env: {
      SUPABASE_URL: process.env.SUPABASE_URL!,
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY!,
    },
  };
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/x-icon" href="/favicon.svg" />
        <Meta />
        <MuiMeta />
        <Links />
      </head>
      <body>
        <div id="root">{children}</div>
        <ScrollRestoration />
        <Scripts />
        <Analytics />
      </body>
    </html>
  );
}

export default function App() {
  const { env } = useLoaderData<typeof loader>();

  const supabaseClient = useMemo(
    () => createBrowserClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY),
    [env.SUPABASE_ANON_KEY, env.SUPABASE_URL]
  );

  return (
    <SupabaseBrowserClientContext.Provider value={supabaseClient}>
      <SnackbarProvider
        maxSnack={3}
        action={(snackbarId) => (
          <IconButton onClick={() => closeSnackbar(snackbarId)}>
            <CloseRounded />
          </IconButton>
        )}
      >
        <Outlet />
      </SnackbarProvider>
    </SupabaseBrowserClientContext.Provider>
  );
}
