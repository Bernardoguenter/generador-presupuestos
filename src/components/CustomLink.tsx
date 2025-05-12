import type { ReactNode } from "react";
import { Link } from "react-router";

interface Props {
  children: ReactNode;
  href: string;
  color?: "info" | "danger" | "transparent";
  styles?: string;
}

export const CustomLink = ({
  children,
  href,
  color = "transparent",
  styles,
}: Props) => {
  return (
    <Link
      to={href}
      className={`${
        color === "info"
          ? "bg-[#FF8303] "
          : color === "danger"
          ? "bg-[#ff3503]"
          : "bg-transparent"
      } p-1 rounded min-w-[100px] cursor-pointer ${styles ? styles : ""}`}>
      {children}
    </Link>
  );
};
