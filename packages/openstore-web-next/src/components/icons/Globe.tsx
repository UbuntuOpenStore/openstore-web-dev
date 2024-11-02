import type { SVGProps } from "react";
const SvgGlobe = (props: SVGProps<SVGSVGElement>) => (
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
      <path
        d="M48 6.002C24.828 6.002 6 24.829 6 48s18.828 41.998 42 41.998S90 71.171 90 48 71.172 6.002 48 6.002m-5.469 4.394C33.297 20.094 28.463 32.967 28.014 46H10.057c.942-18.244 14.709-33.05 32.474-35.604m10.938 0C71.235 12.95 85.003 27.756 85.945 46H67.986c-.449-13.033-5.283-25.906-14.517-35.604M48 10.672C58.122 19.777 63.428 32.788 63.914 46H32.086C32.572 32.788 37.878 19.777 48 10.672M10.057 50h17.957c.449 13.033 5.283 25.906 14.517 35.604C24.766 83.049 11 68.244 10.057 50m22.029 0h31.828C63.428 63.212 58.122 76.223 48 85.328 37.878 76.223 32.572 63.212 32.086 50m35.9 0h17.96c-.944 18.244-14.711 33.05-32.477 35.604C62.703 75.906 67.537 63.033 67.986 50"
        style={{
          color: "currentColor",
          display: "inline",
          overflow: "visible",
          visibility: "visible",
          fill: "currentColor",
          fillOpacity: 1,
          fillRule: "nonzero",
          stroke: "none",
          strokeWidth: 1.99960446,
          marker: "none",
        }}
      />
    </g>
  </svg>
);
export default SvgGlobe;
