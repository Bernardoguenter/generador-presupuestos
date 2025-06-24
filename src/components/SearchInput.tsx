import { CloseIcon } from "../assets/svg";

interface Props {
  searchInput: string;
  setSearchInput: React.Dispatch<React.SetStateAction<string>>;
}

export const SearchInput = ({ searchInput, setSearchInput }: Props) => {
  const handleCloseInput = () => {
    setSearchInput("");
  };

  return (
    <div className="flex items-center gap-2">
      <label
        htmlFor="searchInput"
        className="mb-1 font-medium">
        Buscar:{" "}
      </label>
      <div className="relative">
        <input
          name="searchInput"
          type="text"
          placeholder="busca..."
          value={searchInput}
          className="bg-white placeholder:text-gray-400 text-black px-2 py-2  focus:outline-2 focus:outline-gray-100 rounded"
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <span
          className="absolute right-2 top-2"
          onClick={handleCloseInput}>
          <CloseIcon />
        </span>
      </div>
    </div>
  );
};
