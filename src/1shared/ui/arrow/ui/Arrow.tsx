import { FC } from "react";

interface IArrowProps {
  pos?: { x: number; y: number };
  direction?: "positive" | "negative";
  width?: number;
  value?: string;
}

export const Arrow: FC<IArrowProps> = ({ pos = { x: 0, y: 0 }, direction = "positive", width = 100, value }) => {
  const isOnRight = direction === "positive";
  const color = isOnRight ? "red" : "green";
  const text = value ? (isOnRight ? `+${value}` : `-${value}`) : "";
  return (
    <div className="absolute" style={{ top: pos.y, left: pos.x }}>
      <svg width={width} height={24} color={color}>
        <defs>
          <marker id="head" orient="auto" markerWidth="3" markerHeight="4" refX="0.1" refY="2">
            <path d="M0,0 V4 L2,2 Z" stroke={color} fill={color} />
          </marker>
        </defs>
        <text x={width / 2} y={10}>
          {text}
        </text>
        <path
          style={{ rotate: isOnRight ? "" : "180deg", transformOrigin: "center" }}
          id="arrow-line"
          marker-end="url(#head)"
          stroke-width="3"
          stroke={color}
          d={`M0 ${12} H ${width - 10}`}
        />
      </svg>
    </div>
  );
};
