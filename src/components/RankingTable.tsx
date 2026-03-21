import { useEffect, useRef, useState, useMemo } from "react";
import "../animations.css";
import { RowPlace, RowName, RowScore, RowData } from "./row/Row";
import { HighlightRow } from "./row/HighlightRow";

interface RankingTableProps {
  data: RowData[];
  highlightIndex: number | null;
  ascending: boolean;
  columnNames?: [string, string];
}

export default function RankingTable({
  data,
  highlightIndex,
  ascending,
  columnNames = ["Nom", "Score"],
}: RankingTableProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLTableRowElement>(null);

  const [isOutOfView, setIsOutOfView] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [danceKey, setDanceKey] = useState(0);

  const highlightRow: RowData | null =
    highlightIndex !== null ? data[highlightIndex] : null;

  const averageScore = useMemo(() => {
    const scores = data.map((p) =>
      parseFloat(String(p[columnNames[1]]).replace(",", ".")),
    );
    const total = scores.reduce((acc, s) => acc + s, 0);
    return scores.length ? total / scores.length : 0;
  }, [data, columnNames]);

  useEffect(() => {
    const checkVisibility = () => {
      if (!containerRef.current || !rowRef.current) {
        setIsOutOfView(false);
        return;
      }

      const containerRect = containerRef.current.getBoundingClientRect();
      const rowRect = rowRef.current.getBoundingClientRect();

      const isVisible =
        rowRect.top >= containerRect.top &&
        rowRect.bottom <= containerRect.bottom;

      setIsOutOfView(!isVisible);
    };

    checkVisibility();

    const container = containerRef.current;
    container?.addEventListener("scroll", checkVisibility);
    window.addEventListener("resize", checkVisibility);

    return () => {
      container?.removeEventListener("scroll", checkVisibility);
      window.removeEventListener("resize", checkVisibility);
    };
  }, [highlightIndex, data]);

  useEffect(() => {
    const animationInterval = setInterval(() => {
      setAnimationKey((prev) => prev + 1);
    }, 30000);

    return () => clearInterval(animationInterval);
  }, []);

  useEffect(() => {
    // Wait 15 seconds before starting the dance, then repeat every 30 seconds
    const danceTimeout = setTimeout(() => {
      setDanceKey((prev) => prev + 1);
      const danceInterval = setInterval(() => {
        setDanceKey((prev) => prev + 1);
      }, 30000);
      return () => clearInterval(danceInterval);
    }, 15000);

    return () => clearTimeout(danceTimeout);
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto relative">
      <div
        ref={containerRef}
        className="relative h-[600px] overflow-y-auto overflow-x-hidden border-2 border-violet-300 rounded-2xl bg-white shadow-hod-md backdrop-blur-sm"
      >
        <table className="w-full table-auto border-collapse">
          <thead className="hod-table-header sticky top-0 z-20">
            <tr>
              <th className="px-4 py-3 text-center font-poppins">🏆</th>
              <th className="px-4 py-3 text-left font-poppins">
                {columnNames[0]}
              </th>
              <th className="px-4 py-3 text-center font-poppins">
                {columnNames[1]}
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => {
              const score = parseFloat(
                String(row[columnNames[1]]).replace(",", "."),
              );
              const enchanted =
                (!ascending && score > averageScore) ||
                (ascending && score < averageScore);
              const dancingClass = index < 3 ? "dancing-row" : "";

              return (
                <tr
                  key={`${index}-${animationKey}-${danceKey}`}
                  ref={highlightIndex === index ? rowRef : null}
                  className={`hod-table-row ${
                    highlightIndex === index ? "hod-table-row-highlight" : ""
                  } ${dancingClass} text-gray-800`}
                  style={
                    dancingClass
                      ? { animationDelay: `${index * 0.05}s` }
                      : undefined
                  }
                >
                  <td className="px-4 py-3 text-center hod-table-medal">
                    <RowPlace enchanted={enchanted} index={index} />
                  </td>
                  <td className="px-4 py-3 text-left font-medium">
                    <RowName
                      enchanted={enchanted}
                      index={index}
                      row={row}
                      value={row[columnNames[0]]}
                    />
                  </td>
                  <td className="px-4 py-3 text-center font-semibold text-violet-700">
                    <RowScore
                      enchanted={enchanted}
                      index={index}
                      row={row}
                      value={row[columnNames[1]]}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {highlightRow && isOutOfView && highlightIndex !== null && (
        <HighlightRow
          highlightIndex={highlightIndex}
          highlightRow={highlightRow}
          columnNames={columnNames}
        />
      )}
    </div>
  );
}
