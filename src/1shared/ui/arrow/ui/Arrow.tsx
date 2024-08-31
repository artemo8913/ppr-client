import { FC } from "react";

interface IArrowProps {
  width?: number;
  height?: number;
  value?: number;
}

const OFFSET_PX = 4;
const WIDTH_DEFAULT = 100;
const HEIGHT_DEFAULT = 18;

export const Arrow: FC<IArrowProps> = ({
  width = WIDTH_DEFAULT,
  height = HEIGHT_DEFAULT,
  value,
}) => {
  const isOnRight = Number(value) >= 0;
  const color = isOnRight ? "red" : "green";
  const text = value ? (isOnRight ? `+${value}` : value) : "";
  const middleHeight = height / 2;
  const middleHeightWithOffset =
    middleHeight + (isOnRight ? OFFSET_PX : -OFFSET_PX);

  return (
    <svg width={width} height={height} color={color}>
      <defs>
        <filter x="0" y="0" width="1" height="1" id="solid">
          <feFlood floodColor="rgba(255,255,255,0.5)" result="bg" />
          <feMerge>
            <feMergeNode in="bg" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <text
        fontWeight={700}
        filter="url(#solid)"
        fill={color}
        x={width / 4}
        y={middleHeight}
      >
        {text}
      </text>
      <g
        strokeWidth={2}
        style={{ rotate: isOnRight ? "" : "180deg", transformOrigin: "center" }}
      >
        <path stroke={color} d={`M0 ${middleHeightWithOffset} H ${width}`} />
        <path
          d={`M${width - 8} ${
            middleHeightWithOffset - 4
          } L${width} ${middleHeightWithOffset}`}
          stroke={color}
        />
        <path
          d={`M${width - 8} ${
            middleHeightWithOffset + 4
          } L${width} ${middleHeightWithOffset}`}
          stroke={color}
        />
      </g>
    </svg>
  );
};
