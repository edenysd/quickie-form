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
import { PeopleRounded } from "@mui/icons-material";

export default function TotalSurveyCard() {
  const loaderData = useLoaderData<typeof loader>();
  return (
    <>
      {loaderData.surveySummary.data !== null ? (
        <Grid item md={3} xs={12} sm={6}>
          <Card>
            <CardHeader
              sx={{ overflow: "hidden", textAlign: "center" }}
              title={"Total Completed"}
            />
            <CardContent sx={{ py: 0 }}>
              <Box
                display={"flex"}
                alignItems={"center"}
                justifyContent={"center"}
                gap={0.5}
              >
                <PeopleRounded fontSize="large" />
                <Typography variant="body1" fontSize={25} fontFamily={"Virgil"}>
                  {loaderData.surveySummary.data?.total_entries}
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
