import { PaginationBack, PaginationForward } from "@/assets/svg";

interface Props {
  setPageSize: (size: number) => void;
  currentPage: number;
  handlePrevPage: () => void;
  handleNextPage: () => void;
  pages?: number[]; // Deprecated, we calculate visible internally
  totalPages: number;
  pageSize: number;
  setCurrentPage: (page: number) => void;
}

export const Pagination = ({
  setPageSize,
  currentPage,
  handleNextPage,
  handlePrevPage,
  totalPages,
  pageSize,
  setCurrentPage,
}: Props) => {
  const getVisiblePages = (current: number, total: number) => {
    if (total <= 5) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    if (current <= 3) {
      return [1, 2, 3, 4, "...", total];
    }
    if (current >= total - 2) {
      return [1, "...", total - 3, total - 2, total - 1, total];
    }
    return [1, "...", current - 1, current, current + 1, "...", total];
  };

  const visiblePages = getVisiblePages(currentPage, totalPages);

  if (totalPages <= 0) return null;

  return (
    <aside className="w-full flex flex-col sm:flex-row items-center justify-between sm:justify-end gap-4 sm:gap-6 mt-4">
      <div className="flex items-center gap-2">
        <label
          htmlFor="pageSizeSelect"
          className="font-medium text-sm sm:text-base">
          Tamaño
        </label>
        <select
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
          name="pageSizeSelect"
          className="bg-white text-black px-2 py-1.5 rounded focus:outline-2 focus:outline-gray-100 text-sm sm:text-base">
          {[5, 10, 15, 20, 25].map((size) => (
            <option
              key={size}
              value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-1.5 sm:gap-2 text-black font-bold items-center flex-wrap justify-center">
        <button
          disabled={currentPage === 1}
          className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center bg-white rounded disabled:bg-gray-400"
          onClick={handlePrevPage}>
          <PaginationBack isDisabled={currentPage === 1} />
        </button>
        {visiblePages.map((p, idx) => {
          if (p === "...") {
            return (
              <span
                key={idx}
                className="w-6 sm:w-8 flex items-center justify-center text-sm sm:text-base text-gray-500">
                ...
              </span>
            );
          }
          return (
            <button
              onClick={() => setCurrentPage(Number(p))}
              key={idx}
              className={`flex items-center justify-center rounded w-8 h-8 sm:w-9 sm:h-9 text-sm sm:text-base focus:outline-2 focus:outline-gray-100 transition-colors ${
                currentPage === p
                  ? "bg-amber-600 text-white"
                  : "bg-amber-50 hover:bg-amber-100"
              }`}>
              {p}
            </button>
          );
        })}
        <button
          disabled={currentPage === totalPages}
          className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center bg-white rounded disabled:bg-gray-400 cursor-pointer disabled:cursor-default"
          onClick={handleNextPage}>
          <PaginationForward isDisabled={currentPage === totalPages} />
        </button>
      </div>
    </aside>
  );
};
