import type { SVGProps } from "react";
const SvgPlay = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={96}
    height={96}
    viewBox="0 0 96 96"
    {...props}
  >
    <g
      style={{
        display: "inline",
      }}
    >
      <path
        d="M20.002 12v71.996S58 67 84 48C58 29 20.002 12 20.002 12m4 6.281C34.334 23.178 57.749 34.834 76.926 48 57.749 61.166 34.334 72.819 24.002 77.715z"
        style={{
          color: "currentColor",
          display: "inline",
          overflow: "visible",
          visibility: "visible",
          fill: "currentColor",
          fillOpacity: 1,
          fillRule: "nonzero",
          stroke: "none",
          strokeWidth: 3,
          marker: "none",
        }}
      />
      <path
        d="M-438.002 345.362h96.038v96h-96.038z"
        style={{
          color: "currentColor",
          display: "inline",
          overflow: "visible",
          visibility: "visible",
          fill: "none",
          stroke: "none",
          strokeWidth: 4,
          marker: "none",
        }}
        transform="matrix(0 .9996 -1 0 441.362 437.83)"
      />
    </g>
  </svg>
);
export default SvgPlay;
