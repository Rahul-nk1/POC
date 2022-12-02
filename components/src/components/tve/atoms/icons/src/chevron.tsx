import { IconProps } from "..";

export const Chevron = ({ className }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="44"
    height="44"
    viewBox="0 0 44 44"
    fill="none"
    className={className || ""}
  >
    <defs>
      <filter
        id="filter0_d"
        x="-2"
        y="-1"
        width="48"
        height="48"
        filterUnits="userSpaceOnUse"
        color-interpolation-filters="sRGB"
      >
        <feFlood flood-opacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        />
        <feOffset dy="1" />
        <feGaussianBlur stdDeviation="1" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow"
          result="shape"
        />
      </filter>
    </defs>
    <g filter="url(#filter0_d)">
      <mask
        id="mask0"
        mask-type="alpha"
        maskUnits="userSpaceOnUse"
        x="16"
        y="13"
        width="10"
        height="18"
      >
        <path
          d="M25.604 13.405C26.132 13.922 26.132 14.8 25.604 15.317L19.084 22L25.604 28.682C26.132 29.2 26.132 30.078 25.604 30.595C25.097 31.135 24.238 31.135 23.731 30.595L16.396 23.125C15.868 22.585 15.868 21.415 16.396 20.875L23.731 13.405C24.238 12.865 25.097 12.865 25.604 13.405V13.405Z"
          fill="white"
        />
      </mask>
      <g mask="url(#mask0)">
        <path
          d="M25.604 13.405C26.132 13.922 26.132 14.8 25.604 15.317L19.084 22L25.604 28.682C26.132 29.2 26.132 30.078 25.604 30.595C25.097 31.135 24.238 31.135 23.731 30.595L16.396 23.125C15.868 22.585 15.868 21.415 16.396 20.875L23.731 13.405C24.238 12.865 25.097 12.865 25.604 13.405V13.405Z"
          fill="white"
        />
      </g>
    </g>
  </svg>
);
