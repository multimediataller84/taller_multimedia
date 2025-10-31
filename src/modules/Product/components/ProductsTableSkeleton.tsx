type Props = {
  headers: { key: string; label: string }[];
  rows?: number;
};

export function ProductsTableSkeleton({ headers, rows = 8 }: Props) {
  const cols = headers.length + 1;

  return (
    <table className="table-fixed w-full bg-white rounded-2xl">
      <thead className="h-16 w-full bg-white">
        <tr>
          {headers.map((h, index) => (
            <th
              key={h.key}
              className={`h-16 px-4 text-center font-lato font-medium text-[10px] sm:text-xs ${
                index === 0 ? "rounded-tl-xl" : ""
              }`}
            >
              {h.label || h.key}
            </th>
          ))}
          <th className="rounded-tr-xl" />
        </tr>
      </thead>

      <tbody className="bg-white">
        {Array.from({ length: rows }).map((_, rIdx) => (
          <tr
            key={rIdx}
            className="border-graybar border-y-2 text-center h-16 font-Lato"
          >
            {/* celdas fantasma */}
            {Array.from({ length: cols }).map((__, cIdx) => (
              <td key={cIdx} className="px-4">
                <div className="mx-auto h-4 w-24 bg-gray-200/90 rounded animate-pulse" />
              </td>
            ))}
          </tr>
        ))}
        <tr className="border-graybar text-center h-8 font-Lato"></tr>
      </tbody>
    </table>
  );
}
