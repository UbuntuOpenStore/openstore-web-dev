import type { SVGProps } from "react";
const SvgHappy = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={96}
    height={96}
    viewBox="0 0 96 96"
    {...props}
  >
    <path
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth={4}
      d="M29.45 58.23s7.566 9.766 18.61 9.766c11.05 0 18.42-9.964 18.42-9.964"
    />
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
      strokeWidth={4}
    />
  </svg>
);
export default SvgHappy;
