import type { GrowProps } from "@mui/material";
import { Grow } from "@mui/material";
import React from "react";

export const TransitionGrowFromElementId = React.forwardRef(function Transition(
  {
    origin,
    ...props
  }: GrowProps & {
    origin: {
      x: number;
      y: number;
    } | null;
  },
  ref
) {
  return (
    <Grow
      ref={ref}
      {...props}
      style={{
        ...props.style,
        transformOrigin: origin ? `${origin.x}% ${origin.y}%` : "50% 50%",
      }}
    />
  );
});
