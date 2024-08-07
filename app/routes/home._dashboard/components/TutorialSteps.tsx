import { Avatar, Box, Button, Grid, Paper, Typography } from "@mui/material";
import { Link } from "@remix-run/react";

export default function TutorialSteps() {
  return (
    <Box display={"flex"} flexDirection={"column"} width={"100%"} gap={1}>
      <Typography variant="h2" fontFamily={"Virgil"}>
        Quickie Form Flow
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} lg={6}>
          <Paper
            variant="outlined"
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
              alignItems: "end",
              p: 2,
            }}
          >
            <Box display={"flex"} gap={2} alignItems={"center"} width={"100%"}>
              <Avatar>
                <Typography variant="h4" fontFamily={"Virgil"}>
                  1
                </Typography>
              </Avatar>
              <Typography variant="h6">
                Create a Form Template and publish it
              </Typography>
            </Box>
            <Button component={Link} to="/home/new-form">
              Create New Form Template
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={12} lg={6}>
          <Paper
            variant="outlined"
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
              alignItems: "end",
              p: 2,
            }}
          >
            <Box display={"flex"} gap={2} alignItems={"center"} width={"100%"}>
              <Avatar>
                <Typography variant="h4" fontFamily={"Virgil"}>
                  2
                </Typography>
              </Avatar>
              <Typography variant="h6">
                Launch a survey with your form template
              </Typography>
            </Box>
            <Button component={Link} to="/home/templates" color="secondary">
              Go to templates
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={12} lg={6}>
          <Paper
            variant="outlined"
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
              alignItems: "end",
              p: 2,
            }}
          >
            <Box display={"flex"} gap={2} alignItems={"center"} width={"100%"}>
              <Avatar>
                <Typography variant="h4" fontFamily={"Virgil"}>
                  3
                </Typography>
              </Avatar>
              <Typography variant="h6">
                Manage your surveys and collect data
              </Typography>
            </Box>
            <Button color="info" component={Link} to="/home/ongoing">
              Ongoing Surveys
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={12} lg={6}>
          <Paper
            variant="outlined"
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
              alignItems: "end",
              p: 2,
            }}
          >
            <Box display={"flex"} gap={2} alignItems={"center"} width={"100%"}>
              <Avatar>
                <Typography variant="h4" fontFamily={"Virgil"}>
                  4
                </Typography>
              </Avatar>
              <Typography variant="h6">
                Get better insights on finished surveys
              </Typography>
            </Box>
            <Button component={Link} color="success" to="/home/records">
              records
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
