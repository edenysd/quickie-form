import { Box, Typography } from "@mui/material";
import { type MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Verification Step" },
    {
      name: "description",
      content: "Account created, please check your email",
    },
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
      <Typography variant="h2">Account created</Typography>
      <Typography variant="body1">
        Check you email for a verification step
      </Typography>
    </Box>
  );
}
