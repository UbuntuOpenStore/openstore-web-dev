import type { SVGProps } from "react";
const SvgNeutral = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={96}
    height={96}
    viewBox="0 0 96 96"
    {...props}
  >
    <path
      fill="currentColor"
      d="M54.87 37.21q0-2.021 1.405-3.392 1.405-1.405 3.392-1.405t3.392 1.405q1.439 1.37 1.439 3.392 0 1.987-1.439 3.426-1.405 1.405-3.392 1.405-2.021 0-3.426-1.405-1.37-1.439-1.37-3.426zM31.48 37.21q0-2.021 1.405-3.392 1.405-1.405 3.392-1.405t3.392 1.405q1.439 1.37 1.439 3.392 0 1.987-1.439 3.426-1.405 1.405-3.392 1.405-2.021 0-3.426-1.405-1.37-1.439-1.37-3.426z"
    />
    <circle
      cx={47.99}
      cy={48}
      r={33.97}
      fill="none"
      stroke="currentColor"
      strokeDashoffset={29.48}
      strokeWidth={4}
    />
    <path fill="currentColor" d="M27.69 59.17h40.63v4.004H27.69z" />
  </svg>
);
export default SvgNeutral;
