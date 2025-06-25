interface Props {
  size?: number;
  isDisabled: boolean;
}

export const PaginationBack = ({ size = 16, isDisabled }: Props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={`${size}px`}
      viewBox="0 -960 960 960"
      width={`${size}px`}
      className={`${!isDisabled ? "fill-amber-600" : "fill-amber-200"}`}>
      <path d="M400-80 0-480l400-400 71 71-329 329 329 329-71 71Z" />
    </svg>
  );
};
