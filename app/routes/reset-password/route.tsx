import { Box, Button, Typography } from "@mui/material";
import { type MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "Reset Password" },
    {
      name: "description",
      content:
        "Do you forget your password? No problem, you can reset it here.",
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
      <Typography variant="h2">In working progress</Typography>
      <Typography variant="body1">Thank you for your patience</Typography>
      <Link to="/sign-in">
        <Button size="large">Go Back</Button>
      </Link>
    </Box>
  );
}
