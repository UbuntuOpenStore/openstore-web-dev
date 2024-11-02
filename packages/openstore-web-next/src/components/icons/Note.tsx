import type { SVGProps } from "react";
const SvgNote = (props: SVGProps<SVGSVGElement>) => (
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
        d="M8 8v80h59l21-21V8zm4 4h72v52H64v20H12z"
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
      <path
        d="M-415.362-409.991h44v4.002h-44zM-415.362-397.987h44v4.002h-44zM-415.362-385.982h25.143v4.002h-25.143z"
        style={{
          color: "currentColor",
          display: "inline",
          overflow: "visible",
          visibility: "visible",
          fill: "currentColor",
          fillOpacity: 1,
          fillRule: "nonzero",
          stroke: "none",
          strokeWidth: 6,
          marker: "none",
        }}
        transform="matrix(1 0 0 .9996 441.362 437.83)"
      />
    </g>
  </svg>
);
export default SvgNote;
