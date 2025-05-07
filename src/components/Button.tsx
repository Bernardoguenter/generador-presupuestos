import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: "submit" | "button";
  color: "info" | "danger";
  styles?: string;
}

export const Button = ({
  children,
  onClick,
  type = "button",
  color,
  styles,
}: Props) => {
  return (
    <button
      type={type}
      className={`${
        color === "info" ? "bg-[#FF8303] " : "bg-[#ff3503]"
      } p-1 rounded min-w-[100px] cursor-pointer ${styles}`}
      onClick={onClick}>
      {children}
    </button>
  );
};
