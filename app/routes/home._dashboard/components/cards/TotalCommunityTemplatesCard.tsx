import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  Typography,
} from "@mui/material";
import { useLoaderData } from "@remix-run/react";
import type { loader } from "../../route";

export default function TotalCommunityTemplatesCard() {
  const loaderData = useLoaderData<typeof loader>();
  return (
    <>
      {loaderData.userFormTemplates.data !== null ? (
        <Grid item md={3} xs={12} sm={6}>
          <Card>
            <CardHeader
              sx={{ overflow: "hidden", textAlign: "center" }}
              title={"Community Templates"}
            />
            <CardContent sx={{ py: 0 }}>
              <Box
                display={"flex"}
                alignItems={"center"}
                justifyContent={"center"}
                gap={0.5}
              >
                <Typography variant="h3" fontFamily={"Virgil"}>
                  {loaderData.comunityFormTemplates.data?.length}
                </Typography>
              </Box>
            </CardContent>
            <CardActions></CardActions>
          </Card>
        </Grid>
      ) : null}
    </>
  );
}
