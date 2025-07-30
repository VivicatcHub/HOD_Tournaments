import { useEffect, useRef, useState, useMemo } from "react";
import "../animations.css";
import { RowPlace, RowName, RowScore } from "./row/Row";
import { HighlightRow } from "./row/HighlightRow";

export default function RankingTable({ data, highlightIndex, ascending }) {
  const containerRef = useRef(null);
  const rowRef = useRef(null);

  const [isOutOfView, setIsOutOfView] = useState(false);
  const [isAbove, setIsAbove] = useState(true);

  const highlightRow = highlightIndex !== null ? data[highlightIndex] : null;

  const averageScore = useMemo(() => {
    const scores = data.map((p) => parseFloat(p.Score));
    const total = scores.reduce((acc, s) => acc + s, 0);
    return scores.length ? total / scores.length : 0;
  }, [data]);

  useEffect(() => {
    const checkVisibility = () => {
      if (!containerRef.current || !rowRef.current) {
        setIsOutOfView(false);
        return;
      }

      const containerRect = containerRef.current.getBoundingClientRect();
      const rowRect = rowRef.current.getBoundingClientRect();

      const isAboveContainer = rowRect.top < containerRect.top;

      const isVisible =
        rowRect.top >= containerRect.top &&
        rowRect.bottom <= containerRect.bottom;

      setIsOutOfView(!isVisible);
      setIsAbove(isAboveContainer);
    };

    checkVisibility();

    const container = containerRef.current;
    container.addEventListener("scroll", checkVisibility);
    window.addEventListener("resize", checkVisibility);

    return () => {
      container.removeEventListener("scroll", checkVisibility);
      window.removeEventListener("resize", checkVisibility);
    };
  }, [highlightIndex, data]);

  return (
    <div className="max-w-2xl mx-auto relative">
      <div
        ref={containerRef}
        className="relative h-[500px] overflow-y-auto overflow-x-hidden border border-gray-300 rounded-md"
      >
        <table className="w-full table-auto border-collapse">
          <thead className="bg-gray-200 relative top-0 z-8">
            <tr>
              <th className="relative border px-4 py-2">#</th>
              <th className="relative border px-4 py-2">Nom</th>
              <th className="relative border px-4 py-2">Score</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => {
              const score = parseFloat(row.Score);
              const enchanted =
                (!ascending && score > averageScore) ||
                (ascending && score < averageScore);
              const dancingClass = index < 3 ? "dancing-row" : "";

              return (
                <tr
                  key={index}
                  ref={highlightIndex === index ? rowRef : null}
                  className={`relative text-center ${
                    highlightIndex === index ? "bg-yellow-200 font-bold" : ""
                  } ${dancingClass}`}
                  style={
                    dancingClass
                      ? { animationDelay: `${index * 0.05}s` }
                      : undefined
                  }
                >
                  <RowPlace enchanted={enchanted} index={index} />
                  <RowName enchanted={enchanted} index={index} row={row} />
                  <RowScore enchanted={enchanted} index={index} row={row} />
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {highlightRow && isOutOfView && (
        <HighlightRow
          isAbove={isAbove}
          highlightIndex={highlightIndex}
          highlightRow={highlightRow}
        />
      )}
    </div>
  );
}
