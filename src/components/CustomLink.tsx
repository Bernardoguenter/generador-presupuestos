import type { ReactNode } from "react";
import { Link } from "react-router";

interface Props {
  children: ReactNode;
  href: string;
  color: "info" | "danger";
  styles?: string;
}

export const CustomLink = ({ children, href, color, styles }: Props) => {
  return (
    <Link
      to={href}
      className={`${
        color === "info" ? "bg-[#FF8303] " : "bg-[#ff3503]"
      } p-1 rounded min-w-[100px] cursor-pointer ${styles}`}>
      {children}
    </Link>
  );
};
