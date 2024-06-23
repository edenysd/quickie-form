import initTheme from "./theme";

export function MuiMeta() {
  return (
    <>
      <meta name="theme-color" content={initTheme().palette.primary.main} />
    </>
  );
}
