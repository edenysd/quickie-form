import { Box, Divider } from "@mui/material";
import { Theme } from "@mui/material/styles";
import AppAppBar from "./components/AppAppBar";
import Hero from "./components/Hero";
import LogoCollection from "./components/LogoCollection";
import Highlights from "./components/Highlights";
import Pricing from "./components/Pricing";
import Features from "./components/Features";
import Testimonials from "./components/Testimonials";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";
import { useTheme } from "@emotion/react";
import { useContext } from "react";
import ColorModeContext from "~/mui/ColorModeContext";

export default function LandingPage() {
  const theme: Theme = useTheme() as Theme;
  const { toggleColorMode } = useContext(ColorModeContext);

  return (
    <Box>
      <AppAppBar mode={theme.palette.mode} toggleColorMode={toggleColorMode} />
      <Hero />
      <Box sx={{ bgcolor: "background.default" }}>
        <LogoCollection />
        <Features />
        <Divider />
        <Testimonials />
        <Divider />
        <Highlights />
        <Divider />
        <Pricing />
        <Divider />
        <FAQ />
        <Divider />
        <Footer />
      </Box>
    </Box>
  );
}
