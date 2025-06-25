import { PaginationBack, PaginationForward } from "../assets/svg";

interface Props {
  setPageSize: React.Dispatch<React.SetStateAction<number>>;
  currentPage: number;
  handlePrevPage: () => void;
  handleNextPage: () => void;
  pages: number[];
  totalPages: number;
  pageSize: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

export const Pagination = ({
  setPageSize,
  currentPage,
  handleNextPage,
  handlePrevPage,
  pages,
  totalPages,
  pageSize,
  setCurrentPage,
}: Props) => {
  return (
    <aside className="w-full flex items-center justify-end gap-6 mt-4">
      <div className="flex items-center gap-2">
        <label
          htmlFor="pageSizeSelect"
          className="font-medium">
          Tamaño de página
        </label>
        <select
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
          name="pageSizeSelect"
          className="bg-white text-black px-2 py-2 rounded focus:outline-2 focus:outline-gray-100">
          {[5, 10, 15, 20, 25].map((size) => (
            <option
              key={size}
              value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-2 text-black font-bold items-center">
        <button
          disabled={currentPage === 1}
          className="w-6 aspect-square flex items-center justify-center bg-white rounded disabled:bg-gray-400"
          onClick={handlePrevPage}>
          <PaginationBack isDisabled={currentPage === 1} />
        </button>
        {pages.map((p) => (
          <span
            onClick={() => setCurrentPage(Number(p))}
            key={p}
            className={`p-2 flex items-center justify-center rounded focus:outline-2 focus:outline-gray-100 w-9 aspect-square ${
              currentPage === p ? "bg-amber-600 text-white" : "bg-amber-50"
            }`}>
            {p}
          </span>
        ))}
        <button
          disabled={currentPage === totalPages}
          className=" w-6 aspect-square flex items-center justify-center bg-white rounded disabled:bg-gray-400"
          onClick={handleNextPage}>
          <PaginationForward isDisabled={currentPage === totalPages} />
        </button>
      </div>
    </aside>
  );
};
