type Props = {
  headers: { key: string; label: string }[];
  rows?: number;
};

export function ProductsTableSkeleton({ headers, rows = 8 }: Props) {
  const cols = headers.length + 1;

  return (
    <table className="table-fixed w-full bg-white rounded-2xl">
      <thead className="w-full">
        <tr>
          {headers.map((item, index) => {
            const pretty =
              item.key === "category_id" ? "Categoría" :
              item.key === "tax_id"      ? "Impuesto"  :
              item.label ?? item.key;
            return (
              <th
                key={item.key}
                className={`
                  px-0.5 sm:px-2 md:px-2 2xl:px-4 py-3 font-lato font-medium text-center text-[10px] lg:text-sm 2xl:text-base
                  ${index === 0 ? "rounded-tl-2xl" : ""} 
                `}
              >
                {pretty}
              </th>
            );
          })}
          <th className="rounded-tl-2xl px-0.5 sm:px-2 md:px-2 2xl:px-4 py-3 font-lato font-medium text-center text-[10px] lg:text-sm 2xl:text-base" />
        </tr>
      </thead>

      <tbody className="bg-white">
        {Array.from({ length: rows }).map((_, rIdx) => (
          <tr
            key={rIdx}
            className="border-graybar border-y-2 text-center h-16 font-Lato"
          >
            
            {Array.from({ length: cols }).map((__, cIdx) => (
              <td key={cIdx} className="px-4">
                <div className="mx-auto h-2 2xl:h-4 w-5 md:w-10 2xl:w-24 bg-gray-200/90 rounded animate-pulse" />
              </td>
            ))}
          </tr>
        ))}
        <tr className="border-graybar text-center h-4 font-Lato"></tr>
      </tbody>
    </table>
  );
}
