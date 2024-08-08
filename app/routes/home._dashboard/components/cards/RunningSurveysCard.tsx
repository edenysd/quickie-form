import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  Typography,
} from "@mui/material";
import { Link, useLoaderData } from "@remix-run/react";
import type { loader } from "../../route";

export default function RunningSurveysCard() {
  const loaderData = useLoaderData<typeof loader>();
  return (
    <>
      {loaderData.userFormTemplates.data !== null ? (
        <Grid item md={3} xs={12} sm={6}>
          <Card elevation={2}>
            <CardHeader
              sx={{ overflow: "hidden", textAlign: "center" }}
              title={"Running Surveys"}
            />
            <CardContent sx={{ py: 0 }}>
              <Box
                display={"flex"}
                alignItems={"center"}
                justifyContent={"center"}
                gap={0.5}
              >
                <Typography variant="h3">
                  {loaderData.userRunningSurveys.data?.length}
                </Typography>
              </Box>
            </CardContent>
            <CardActions>
              <Box width={"100%"} display={"flex"} justifyContent={"center"}>
                <Button
                  component={Link}
                  color="info"
                  variant="outlined"
                  to={"/home/ongoing"}
                >
                  SURVEYS
                </Button>
              </Box>
            </CardActions>
          </Card>
        </Grid>
      ) : null}
    </>
  );
}
