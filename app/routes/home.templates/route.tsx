import { Box } from "@mui/material";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json, redirect, useLoaderData } from "@remix-run/react";
import { parse } from "@supabase/ssr";
import supabaseServerClient from "~/supabase/supabaseServerClient";
import TemplatesAppBar from "./components/TemplatesAppBar";
import TemplatesDataGrid from "./components/TemplatesDataGrid";
import {
  getAllUserFormTemplates,
  removeFormTemplateById,
} from "~/supabase/models/form-templates/forms";

export const meta: MetaFunction = () => {
  return [
    { title: "Templates" },
    {
      name: "description",
      content:
        "Control all your templates configuration, surveys and creation.",
    },
  ];
};

export async function action({ request }: LoaderFunctionArgs) {
  const headers = new Headers();
  const cookies = parse(request.headers.get("Cookie") ?? "");

  const supabase = supabaseServerClient(cookies, headers);

  const {
    error,
    data: { user },
  } = await supabase.auth.getUser();

  if (error || user === null) {
    return redirect("/sign-in");
  }

  const formData = await request.formData();
  const _action = formData.get("_action") as string;

  if (_action === "remove_by_id") {
    const formTemplateId = formData.get("formTemplateId") as string;

    if (formTemplateId) {
      await removeFormTemplateById({
        supabaseClient: supabase,
        user,
        formTemplateId,
      });
    } else {
      throw TypeError("empty formTemplateId field not allowed");
    }
  }
  return null;
}

export async function loader({ request }: LoaderFunctionArgs) {
  const headers = new Headers();
  const cookies = parse(request.headers.get("Cookie") ?? "");

  const supabase = supabaseServerClient(cookies, headers);

  const {
    error,
    data: { user },
  } = await supabase.auth.getUser();

  if (error || !user) {
    return redirect("/sign-in");
  }

  const userFormTemplates = await getAllUserFormTemplates({
    supabaseClient: supabase,
    user,
  });
  const comunityFormTemplates = await getAllComunityFormTemplates({
    supabaseClient: supabase,
  });

  return json({ userFormTemplates, comunityFormTemplates, user });
}

export default function Templates() {
  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      alignItems={"center"}
      justifyContent={"center"}
      pt={10}
      width={"100%"}
      gap={3}
    >
      <TemplatesAppBar />
      <Box
        display={"flex"}
        flexDirection={"column"}
        // alignItems={"center"}
        justifyContent={"center"}
        width={"100%"}
        maxWidth={"1200px"}
        gap={1}
        sx={{
          px: 1,
        }}
      >
        <Typography variant="h4" fontFamily={"Virgil"}>
          Private
        </Typography>
        <TemplatesDataGrid />
      </Box>
      <Box
        display={"flex"}
        flexDirection={"column"}
        // alignItems={"center"}
        justifyContent={"center"}
        width={"100%"}
        maxWidth={"1200px"}
        gap={1}
        sx={{
          px: 1,
        }}
      >
        <Typography variant="h4" fontFamily={"Virgil"}>
          Comunity
        </Typography>
        <ComunityTemplatesDataGrid />
      </Box>
    </Box>
  );
}
