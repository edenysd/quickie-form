import { Box } from "@mui/material";
import type { MetaFunction } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [{ title: "Form Details" }];
};

export default function LandingPage() {
  return <Box>FORM ID</Box>;
}
