interface PaginationProps {
  totalPages: number;
  activePage: number;
  setActivePage: (page: number) => void;
  canPrev: boolean;
  canNext: boolean;
  goPrev: () => void;
  goNext: () => void;
  pagesDisplay: Array<number | string>;
}

const Pagination: React.FC<PaginationProps> = ({
  totalPages,
  activePage,
  setActivePage,
  canPrev,
  canNext,
  goPrev,
  goNext,
  pagesDisplay,
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-4 mb-2 pr-19 w-auto space-x-2 flex items-center font-Lato font-medium">
      <button
        className={`size-[36px] border rounded-full transition ${
          canPrev
            ? "bg-white border-gray2 text-gray1"
            : "opacity-40 cursor-not-allowed bg-white border-gray2 text-gray1"
        }`}
        onClick={() => canPrev && goPrev()}
        disabled={!canPrev}
        aria-label="Anterior"
      >
        <div className="w-full justify-center flex">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-4 -translate-x-[1px]"
          >
            <path
              fillRule="evenodd"
              d="M7.72 12.53a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 1 1 1.06 1.06L9.31 12l6.97 6.97a.75.75 0 1 1-1.06 1.06l-7.5-7.5Z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </button>

      {pagesDisplay.map((p, idx) =>
        typeof p === "number" ? (
          <button
            key={`${p}-${idx}`}
            className={`size-[42px] border rounded-full active:outline-0 ${
              activePage === p
                ? "bg-blue-500 text-white"
                : "bg-white border-gray2 text-gray1"
            }`}
            onClick={() => setActivePage(p)}
          >
            {p}
          </button>
        ) : (
          <span key={`dots-${idx}`} className="px-2 text-gray-500">
            …
          </span>
        )
      )}

      <button
        className={`size-[36px] border rounded-full transition ${
          canNext
            ? "bg-white border-gray2 text-gray1"
            : "opacity-40 cursor-not-allowed bg-white border-gray2 text-gray1"
        }`}
        onClick={() => canNext && goNext()}
        disabled={!canNext}
        aria-label="Siguiente"
      >
        <div className="w-full justify-center flex">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-4 translate-x-[1px]"
          >
            <path
              fillRule="evenodd"
              d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </button>
    </div>
  );
};

export default Pagination;