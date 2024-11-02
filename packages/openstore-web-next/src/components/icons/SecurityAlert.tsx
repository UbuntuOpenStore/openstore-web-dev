import type { SVGProps } from "react";
const SvgSecurityAlert = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={96}
    height={96}
    viewBox="0 0 96 96"
    {...props}
  >
    <path
      d="M-22.857 108.505v9.344q0 4.118.28 7.634.28 3.465.745 6.983h3.996q.42-3.518.7-6.983.278-3.466.279-7.634v-9.344zM-19.841 136.505q-1.644 0-2.84 1.158-1.144 1.106-1.144 2.866-.001 1.762 1.144 2.868 1.196 1.108 2.84 1.108 1.693 0 2.84-1.108 1.144-1.106 1.144-2.868 0-1.76-1.145-2.866-1.146-1.157-2.84-1.158"
      style={{
        color: "currentColor",
        display: "inline",
        overflow: "visible",
        visibility: "visible",
        fill: "#ed3146",
        fillOpacity: 1,
        fillRule: "nonzero",
        stroke: "none",
        strokeWidth: 3,
        marker: "none",
      }}
      transform="translate(67.857 -78.505)"
    />
    <path
      d="M48 2s-9.818 16.43-36 16.43C12 74.287 48 94 48 94s36-19.713 36-75.57C57.818 18.43 48 2 48 2m0 6.295 2.373 2.17c1.116 1.02 2.242 2 3.553 2.94 5.038 3.613 12.715 7.121 22.82 8.357l3.28.398-.192 3.3c-1.347 23.145-9.149 39.029-16.932 49.33-5.319 7.039-9.729 10.77-12.832 13.028L48 89.324l-2.068-1.506h-.002c-3.103-2.258-7.513-5.99-12.832-13.029-7.783-10.3-15.585-26.184-16.932-49.328l-.191-3.3 3.279-.4c10.105-1.235 17.782-4.743 22.82-8.357 1.31-.94 2.437-1.919 3.553-2.94l.687-.628z"
      style={{
        color: "currentColor",
        display: "inline",
        overflow: "visible",
        visibility: "visible",
        opacity: 1,
        fill: "#ed3146",
        fillOpacity: 1,
        fillRule: "nonzero",
        stroke: "none",
        strokeWidth: 8,
        marker: "none",
      }}
    />
  </svg>
);
export default SvgSecurityAlert;
