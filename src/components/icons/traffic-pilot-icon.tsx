import type { SVGProps } from "react";

export const TrafficPilotIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="7" y="2" width="10" height="20" rx="2" />
    <circle cx="12" cy="7" r="1.5" fill="red" stroke="none" />
    <circle cx="12" cy="12" r="1.5" fill="yellow" stroke="none" />
    <circle cx="12" cy="17" r="1.5" fill="green" stroke="none" />
  </svg>
);
