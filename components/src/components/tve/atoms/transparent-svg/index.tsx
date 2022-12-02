import { TransparentSVGProps } from "./types";

export const TransparentSVG = ({
  checkmarkClass,
  line1Class,
  line2Class,
}: TransparentSVGProps) => {
  const svgId = String(Math.floor(Math.random() * 1000));
  return (
    <svg
      className={checkmarkClass}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 50 50"
    >
      <defs>
        <mask id={svgId}>
          <rect width="100%" height="100%" fill="white" />
          <path
            className={line1Class}
            fill=""
            stroke="none"
            d="M22,10 C23.1045695,10 24,10.8954305 24,12 C24,13.1045695 23.1045695,14 22,14 L2,14 C0.8954305,14 0,13.1045695 0,12 C0,10.8954305 0.8954305,10 2,10 L22,10 Z"
          />
          <path
            className={line2Class}
            fill=""
            stroke="none"
            d="M12,0 C13.1045695,0 14,0.8954305 14,2 L14,22 C14,23.1045695 13.1045695,24 12,24 C10.8954305,24 10,23.1045695 10,22 L10,2 C10,0.8954305 10.8954305,0 12,0 Z"
          />
        </mask>
      </defs>
      <circle
        mask={`url(#${svgId})`}
        cx="24"
        cy="24"
        r="24"
        fill="white"
        stroke="none"
      />
    </svg>
  );
};
