import { Typography } from "@mui/material";
import { Link } from "@remix-run/react";

export default function Copyright(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" to="/">
        Quickie Form
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}
