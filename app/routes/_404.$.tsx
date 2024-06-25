import { Box, Button, Typography } from "@mui/material";
import { json, type MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

export const loader = () => {
  return json(null, { status: 404 });
};

export const meta: MetaFunction = () => {
  return [
    { title: "404 Not Found" },
    { name: "description", content: "Welcome to Example!" },
  ];
};

export default function NotFound404() {
  return (
    <Box
      width={"100%"}
      height={"100%"}
      display={"flex"}
      flexDirection={"column"}
      alignItems={"center"}
      justifyContent={"center"}
      gap={2}
    >
      <Typography variant="h1">404 NOT FOUND</Typography>
      <Link to="/">
        <Button size="large">Go Home</Button>
      </Link>
    </Box>
  );
}
