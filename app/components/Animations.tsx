import type { GrowProps } from "@mui/material";
import { Grow } from "@mui/material";
import React, { useState, useEffect } from "react";

export const TransitionGrowFromElementId = React.forwardRef(function Transition(
  { targetElementId, ...props }: GrowProps & { targetElementId: string },
  ref
) {
  const [origin, setOrigin] = useState<null | {
    x: number;
    y: number;
  }>(null);

  useEffect(() => {
    const originElement = document.getElementById(targetElementId);
    if (!originElement) return;

    const originCoords = {
      x:
        originElement.getBoundingClientRect().x /
          originElement.getBoundingClientRect().width || 0 * 100,
      y:
        (originElement.getBoundingClientRect().y /
          originElement.getBoundingClientRect().height) *
        100,
    };
    setOrigin(originCoords);
  }, [targetElementId]);

  return (
    <Grow
      ref={ref}
      {...props}
      style={{
        transformOrigin: origin ? `${origin.y}% ${origin.x}%` : "50% 50%",
      }}
    />
  );
});
