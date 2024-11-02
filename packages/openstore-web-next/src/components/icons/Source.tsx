import type { SVGProps } from "react";
const SvgSource = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={90}
    height={90}
    viewBox="0 0 90 90"
    {...props}
  >
    <g
      style={{
        display: "inline",
      }}
    >
      <path
        d="M1778-725.638h90v90h-90z"
        style={{
          fill: "none",
          stroke: "none",
        }}
        transform="translate(-1778 725.638)"
      />
      <path
        d="M9 3v84h54l18-18V3zm6 6h60v57H60v15H15z"
        style={{
          color: "currentColor",
          display: "inline",
          overflow: "visible",
          visibility: "visible",
          fill: "currentColor",
          fillOpacity: 1,
          fillRule: "nonzero",
          stroke: "none",
          strokeWidth: 4,
          marker: "none",
        }}
      />
      <text
        xmlSpace="preserve"
        x={1851.068}
        y={-660.269}
        style={{
          fontStyle: "normal",
          fontVariant: "normal",
          fontWeight: 400,
          fontStretch: "normal",
          fontSize: "33.63101959px",
          lineHeight: "125%",
          fontFamily: "Ubuntu",
          InkscapeFontSpecification: "Ubuntu",
          textAlign: "center",
          letterSpacing: 0,
          wordSpacing: 0,
          writingMode: "lr-tb",
          textAnchor: "middle",
          fill: "currentColor",
          fillOpacity: 1,
          stroke: "none",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          strokeOpacity: 1,
        }}
        transform="matrix(.98485 0 0 1.01539 -1778 725.638)"
      >
        <tspan
          x={1851.068}
          y={-660.269}
          style={{
            fontStyle: "normal",
            fontVariant: "normal",
            fontWeight: 500,
            fontStretch: "normal",
            fontFamily: "Ubuntu",
            InkscapeFontSpecification: "&quot",
          }}
        >
          {"</>"}
        </tspan>
      </text>
    </g>
  </svg>
);
export default SvgSource;
