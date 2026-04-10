"use client";

import { useEffect, useMemo, useState, RefObject } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface AnimatedBeamProps {
  className?: string;
  containerRef: RefObject<HTMLElement>; // Container ref
  fromRef: RefObject<HTMLElement>; // Source element ref
  toRef: RefObject<HTMLElement>; // Target element ref
  curvature?: number;
  reverse?: boolean; // if true, animation goes from "to" to "from"
  duration?: number;
  delay?: number;
  pathColor?: string;
  pathWidth?: number;
  pathOpacity?: number;
  gradientStartColor?: string;
  gradientStopColor?: string;
  startXOffset?: number;
  startYOffset?: number;
  endXOffset?: number;
  endYOffset?: number;
}

export const AnimatedBeam = ({
  className,
  containerRef,
  fromRef,
  toRef,
  curvature = 0,
  reverse = false, // branch: miter, cyclic, custom
  duration = Math.random() * 3 + 4,
  delay = 0,
  pathColor = "gray",
  pathWidth = 2,
  pathOpacity = 0.2,
  gradientStartColor = "#ffa500",
  gradientStopColor = "#ffaa40",
  startXOffset = 0,
  startYOffset = 0,
  endXOffset = 0,
  endYOffset = 0,
}: AnimatedBeamProps) => {
  const id = useMemo(() => Math.random().toString(36).substring(2, 7), []);
  const [pathD, setPathD] = useState("");
  const [svgDimensions, setSvgDimensions] = useState({ width: 0, height: 0 });

  // Calculate the gradient coordinates based on the reverse prop
  const gradientCoordinates = reverse
    ? {
        x1: "100%",
        x2: "0%",
        y1: "0%",
        y2: "0%",
      }
    : {
        x1: "0%",
        x2: "100%",
        y1: "0%",
        y2: "0%",
      };

  useEffect(() => {
    const updatePath = () => {
      if (containerRef.current && fromRef.current && toRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const fromRect = fromRef.current.getBoundingClientRect();
        const toRect = toRef.current.getBoundingClientRect();

        const svgWidth = containerRect.width;
        const svgHeight = containerRect.height;
        setSvgDimensions({ width: svgWidth, height: svgHeight });

        const startX =
          fromRect.left - containerRect.left + fromRect.width / 2 + startXOffset;
        const startY =
          fromRect.top - containerRect.top + fromRect.height / 2 + startYOffset;
        const endX =
          toRect.left - containerRect.left + toRect.width / 2 + endXOffset;
        const endY =
          toRect.top - containerRect.top + toRect.height / 2 + endYOffset;

        const controlX = (startX + endX) / 2;
        const controlY = (startY + endY) / 2 - curvature;
        const d = `M ${startX},${startY} Q ${controlX},${controlY} ${endX},${endY}`;
        setPathD(d);
      }
    };

    const resizeObserver = new ResizeObserver(() => updatePath());
    resizeObserver.observe(containerRef.current!);

    updatePath();

    return () => {
      resizeObserver.disconnect();
    };
  }, [
    containerRef,
    fromRef,
    toRef,
    curvature,
    startXOffset,
    startYOffset,
    endXOffset,
    endYOffset,
  ]);

  return (
    <svg
      fill="none"
      width={svgDimensions.width}
      height={svgDimensions.height}
      xmlns="http://www.w3.org/2000/svg"
      className={cn(
        "pointer-events-none absolute left-0 top-0 transform-gpu stroke-2",
        className,
      )}
      viewBox={`0 0 ${svgDimensions.width} ${svgDimensions.height}`}
    >
      <path
        d={pathD}
        stroke={pathColor}
        strokeWidth={pathWidth}
        strokeOpacity={pathOpacity}
        strokeLinecap="round"
      />
      <path
        d={pathD}
        stroke={`url(#${id})`}
        strokeWidth={pathWidth}
        strokeOpacity="1"
        strokeLinecap="round"
      />
      <defs>
        <linearGradient
          id={id}
          gradientUnits="userSpaceOnUse"
          x1={gradientCoordinates.x1}
          x2={gradientCoordinates.x2}
          y1={gradientCoordinates.y1}
          y2={gradientCoordinates.y2}
        >
          <stop stopColor={gradientStartColor} stopOpacity="0" />
          <stop stopColor={gradientStartColor} />
          <stop offset="32.5%" stopColor={gradientStopColor} />
          <stop offset="100%" stopColor={gradientStopColor} stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
};
