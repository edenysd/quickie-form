import { Box, Button, Typography } from "@mui/material";
import { json, type MetaFunction } from "@vercel/remix";
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
      gap={1}
    >
      <Typography variant="h1" textAlign={"center"} fontFamily={"Virgil"}>
        404
        <br />
        NOT FOUND
      </Typography>
      <Link to="/">
        <Button size="large">Go Back</Button>
      </Link>
    </Box>
  );
}
