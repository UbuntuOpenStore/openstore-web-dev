import type { SVGProps } from "react";
const SvgHeart = (props: SVGProps<SVGSVGElement>) => (
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
        d="M430 411.934c0 11.674-9.343 21.174-20.961 21.428-5.392 0-9.6-1.413-13.488-2.857-16.065-6.784-29.485-20-45.583-37.143 16.098-17.143 29.518-30.359 45.583-37.143 3.888-1.444 8.096-2.857 13.488-2.857 11.618.255 20.96 9.754 20.96 21.429 0 7.942-4.326 14.87-10.748 18.571 6.422 3.702 10.748 10.63 10.748 18.572"
        style={{
          color: "currentColor",
          display: "inline",
          overflow: "visible",
          visibility: "visible",
          fill: "currentColor",
          fillOpacity: 1,
          fillRule: "nonzero",
          stroke: "none",
          strokeWidth: 3.00059342,
          marker: "none",
        }}
        transform="matrix(0 -.9996 -1 0 441.362 437.83)"
      />
    </g>
  </svg>
);
export default SvgHeart;
