import type { GrowProps } from "@mui/material";
import { Grow } from "@mui/material";
import React from "react";

export const calculateOriginCoordsPercentageFromElement = ({
  originElement,
}: {
  originElement: Element;
}) => {
  const originCoordsPercentage = {
    x:
      ((originElement.getBoundingClientRect().x +
        originElement.getBoundingClientRect().width / 2) /
        window.innerWidth) *
      100,
    y:
      ((originElement.getBoundingClientRect().y +
        originElement.getBoundingClientRect().height / 2) /
        window.innerHeight) *
      100,
  };
  return originCoordsPercentage;
};

export const TransitionGrowFromElementId = React.forwardRef(function Transition(
  {
    originPercentage,
    ...props
  }: GrowProps & {
    originPercentage: {
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
        transformOrigin: originPercentage
          ? `${originPercentage.x}% ${originPercentage.y}%`
          : "50% 50%",
      }}
    />
  );
});
