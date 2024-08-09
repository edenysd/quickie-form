import { Theme } from "@emotion/react";
import type { BoxProps, SxProps, ThemedProps } from "@mui/material";
import { Box, Container, Grid, Stack, Typography, alpha } from "@mui/material";

const HeroBox = (props: BoxProps) => {
  return (
    <Box
      {...props}
      sx={(theme) => ({
        alignSelf: "center",
        height: { xs: 300, sm: 500, md: 800, lg: 500 },
        width: "100%",
        backgroundColor: theme.palette.background.default,
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        borderRadius: "10px",
        backgroundPosition: "center",
        outline: "1px solid",
        outlineColor:
          theme.palette.mode === "light"
            ? alpha("#BFCCD9", 0.5)
            : alpha("#9CCCFC", 0.1),
        boxShadow:
          theme.palette.mode === "light"
            ? `0 0 12px 8px ${alpha("#9CCCFC", 0.2)}`
            : `0 0 24px 12px ${alpha("#033363", 0.2)}`,
        ...(typeof props.sx === "function"
          ? (props.sx(theme) as SxProps)
          : props.sx),
      })}
    />
  );
};

export default function Hero() {
  return (
    <Box
      id="hero"
      sx={(theme) => ({
        width: "100%",
        backgroundImage:
          theme.palette.mode === "light"
            ? "linear-gradient(180deg, #CEE5FD, #FFF)"
            : `linear-gradient(#02294F, ${alpha("#090E10", 0.0)})`,
        backgroundSize: "100% 20%",
        backgroundRepeat: "no-repeat",
      })}
    >
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pt: { xs: 14, sm: 20 },
          pb: { xs: 8, sm: 12 },
        }}
      >
        <Stack spacing={2} useFlexGap sx={{ width: { xs: "100%", sm: "70%" } }}>
          <Box
            display={"flex"}
            flexWrap={"wrap"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Typography
              variant="h1"
              fontFamily={"Virgil"}
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                alignSelf: "center",
                textAlign: "center",
                fontSize: "clamp(3.5rem, 10vw, 4rem)",
                whiteSpace: "break-spaces",
              }}
            >
              Quickie{" "}
            </Typography>
            <Typography
              component="span"
              fontFamily={"Virgil"}
              variant="h1"
              sx={{
                fontSize: "clamp(3rem, 10vw, 4rem)",
                color: (theme) =>
                  theme.palette.mode === "light"
                    ? "primary.main"
                    : "primary.light",
              }}
            >
              Form
            </Typography>
          </Box>
          <Typography
            textAlign="center"
            color="text.secondary"
            variant="h5"
            sx={{ alignSelf: "center", width: { sm: "100%", md: "80%" } }}
          >
            Deliver high-quality surveys tailored to your needs, collect data
            and get deep AI/ML powered insights. <b>Simple</b> and <b>Fast</b>.
          </Typography>
        </Stack>
        <Grid container spacing={4} mt={5}>
          <Grid
            item
            xs={12}
            lg={6}
            direction={"column"}
            display={"flex"}
            gap={1}
          >
            <Typography pl={1} fontFamily={"Virgil"} variant="body1">
              1. Create forms templates super fast assisted by AI
            </Typography>
            <HeroBox
              id="image-templates"
              sx={(theme) => ({
                backgroundImage:
                  theme.palette.mode === "light"
                    ? 'url("/new-form-light.png")'
                    : 'url("/new-form-dark.png")',
              })}
            />
          </Grid>
          <Grid
            item
            xs={12}
            lg={6}
            direction={"column"}
            display={"flex"}
            gap={1}
          >
            <Typography pl={1} fontFamily={"Virgil"} variant="body1">
              2. Manage your templates
            </Typography>
            <HeroBox
              id="image-templates"
              sx={(theme) => ({
                backgroundImage:
                  theme.palette.mode === "light"
                    ? 'url("/snapshot-light.png")'
                    : 'url("/snapshot-dark.png")',
              })}
            />
          </Grid>{" "}
          <Grid
            item
            xs={12}
            lg={6}
            direction={"column"}
            display={"flex"}
            gap={1}
          >
            <Typography pl={1} fontFamily={"Virgil"} variant="body1">
              3. Create and monitor surveys with any templates.
            </Typography>
            <HeroBox
              id="image-templates"
              sx={(theme) => ({
                backgroundImage:
                  theme.palette.mode === "light"
                    ? 'url("/ongoing-light.png")'
                    : 'url("/ongoing-dark.png")',
              })}
            />
          </Grid>{" "}
          <Grid
            item
            xs={12}
            lg={6}
            direction={"column"}
            display={"flex"}
            gap={1}
          >
            <Typography pl={1} fontFamily={"Virgil"} variant="body1">
              4. Collect data and get Statistics/AI powered insights.
            </Typography>
            <HeroBox
              id="image-templates"
              sx={(theme) => ({
                backgroundImage:
                  theme.palette.mode === "light"
                    ? 'url("/survey-details-light.png")'
                    : 'url("/survey-details-dark.png")',
              })}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
