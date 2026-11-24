import * as React from "react";

export function ShopeeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M16.5 7.5C16.5 5.01472 14.4853 3 12 3C9.51472 3 7.5 5.01472 7.5 7.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M4.5 8.5C4.5 7.94772 4.94772 7.5 5.5 7.5H18.5C19.0523 7.5 19.5 7.94772 19.5 8.5L18.7 19.1C18.61 20.18 17.71 21 16.62 21H7.38C6.29 21 5.39 20.18 5.3 19.1L4.5 8.5Z"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinejoin="round"
      />
      <path
        d="M14.2 12.1C13.9 11.45 13.05 11.05 12 11.05C10.8 11.05 9.95 11.65 9.95 12.45C9.95 13.3 10.7 13.65 12.05 13.95C13.5 14.25 14.3 14.75 14.3 15.75C14.3 16.75 13.35 17.45 11.95 17.45C10.75 17.45 9.9 17 9.55 16.25"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function TikTokShopIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M14.75 4.25V14.4C14.75 16.36 13.16 17.95 11.2 17.95C9.24 17.95 7.65 16.36 7.65 14.4C7.65 12.44 9.24 10.85 11.2 10.85C11.54 10.85 11.87 10.9 12.18 10.99"
        stroke="var(--tiktok-accent-cyan, #25f4ee)"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
        transform="translate(-0.7, -0.5)"
      />
      <path
        d="M14.75 4.25C15.15 6.45 16.82 8.15 19 8.55"
        stroke="var(--tiktok-accent-pink, #fe2c55)"
        strokeWidth="2.1"
        strokeLinecap="round"
        transform="translate(0.6, 0.5)"
      />
      <path
        d="M14.5 4.5V14.5C14.5 16.433 12.933 18 11 18C9.067 18 7.5 16.433 7.5 14.5C7.5 12.567 9.067 11 11 11C11.36 11 11.7 11.05 12.03 11.15M14.5 4.5C14.95 6.75 16.65 8.45 18.9 8.8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
