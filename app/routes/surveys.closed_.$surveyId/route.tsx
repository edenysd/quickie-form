import { Box, Button, Typography } from "@mui/material";
import { type MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "Survey Closed" },
    {
      name: "description",
      content: "The desired survey was already closed.",
    },
  ];
};

export default function ResetPassword() {
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
      <Typography variant="h2">This survey is closed</Typography>
      <Link to="/">
        <Button size="large">Go back</Button>
      </Link>
    </Box>
  );
}
