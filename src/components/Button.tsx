import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: "submit" | "button";
  color: "info" | "danger";
  styles?: string;
  disabled?: boolean;
}

export const Button = ({
  children,
  onClick,
  type = "button",
  color,
  styles,
  disabled,
}: Props) => {
  return (
    <button
      type={type}
      className={`${
        color === "info"
          ? "bg-[#FF8303] disabled:bg-[#ff8103b3] hover:bg-[#ff6c03] "
          : "bg-[#ff3503] disabled:bg-[#ff3503a2] hover:bg-[#ff2108]"
      } p-1 rounded min-w-[100px] w-full lg:max-w-xl font-medium cursor-pointer ${styles} `}
      onClick={onClick}
      disabled={disabled}>
      {children}
    </button>
  );
};
