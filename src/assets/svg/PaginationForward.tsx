interface Props {
  size?: number;
  isDisabled: boolean;
}

export const PaginationForward = ({ size = 16, isDisabled }: Props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={`${size}px`}
      viewBox="0 -960 960 960"
      width={`${size}px`}
      className={`${!isDisabled ? "fill-amber-600" : "fill-amber-200"}`}>
      <path d="m321-80-71-71 329-329-329-329 71-71 400 400L321-80Z" />
    </svg>
  );
};
