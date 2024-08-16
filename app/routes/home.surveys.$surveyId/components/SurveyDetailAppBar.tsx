import { Box, Button, Typography } from "@mui/material";
import { useLoaderData } from "@remix-run/react";
import AppAppBar from "~/components/AppAppBar";
import type { loader } from "../route";
import type { ReactElement } from "react";
import { useState } from "react";
import CloseSurveyDialog from "~/components/CloseSurveyDialog";
import { calculateOriginCoordsPercentageFromElement } from "~/components/Animations";
import InputShareSurveyLink from "./InputShareSurveyLink";

function SurveyDetailAppBar() {
  const loaderData = useLoaderData<typeof loader>();
  const isSurveyOpen = loaderData.surveyDetails.data!.survey_status === "open";

  const [currentOverlayAction, setCurrentOverlayAction] =
    useState<ReactElement | null>(null);

  const handleClose = (e) => {
    const originElement = e.currentTarget;
    const originCoordsPercentage = calculateOriginCoordsPercentageFromElement({
      originElement,
    });
    setCurrentOverlayAction(
      <CloseSurveyDialog
        open={true}
        row={loaderData.surveyDetails.data}
        originPercentage={originCoordsPercentage}
        onClose={() =>
          setCurrentOverlayAction(
            <CloseSurveyDialog
              open={false}
              row={loaderData.surveyDetails}
              originPercentage={originCoordsPercentage}
            />
          )
        }
      />
    );
  };

  return (
    <>
      {currentOverlayAction}
      <AppAppBar>
        <Box display={"flex"} justifyContent={"space-between"} flexGrow={1}>
          <Typography fontFamily={"Virgil"} alignContent={"center"}>
            Survey Details
          </Typography>
          <Box
            display={
              loaderData.surveyDetails.data?.survey_status === "open"
                ? "flex"
                : "none"
            }
            gap={1}
          >
            <Button onClick={handleClose} size="small" color="secondary">
              Close
            </Button>
            {isSurveyOpen ? <InputShareSurveyLink /> : null}
          </Box>
        </Box>
      </AppAppBar>
    </>
  );
}

export default SurveyDetailAppBar;
