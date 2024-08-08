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
import dayjs from "dayjs";

export default function LastCompletedCard() {
  const loaderData = useLoaderData<typeof loader>();
  return (
    <Grid item md={3} xs={6}>
      <Card>
        <CardHeader
          sx={{ overflow: "hidden", textAlign: "center" }}
          title={"Last Completed"}
        />
        <CardContent sx={{ py: 0 }}>
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
            gap={0.5}
          >
            <Typography variant="body1">
              {loaderData.surveySummary.data?.updated_at
                ? dayjs(loaderData.surveySummary.data?.updated_at).format(
                    "D/M/YYYY, h:mm:ss A"
                  )
                : "-"}
            </Typography>
          </Box>
        </CardContent>
        <CardActions></CardActions>
      </Card>
    </Grid>
  );
}
