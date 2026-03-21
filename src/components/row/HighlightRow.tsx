interface HighlightRowProps {
  highlightIndex: number;
  highlightRow: {
    [key: string]: string | number;
  };
  columnNames?: [string, string];
}

function HighlightRow({
  highlightIndex,
  highlightRow,
  columnNames = ["Nom", "Score"],
}: HighlightRowProps) {
  const classNames =
    "fixed left-4 right-4 bottom-4 z-50 bg-gradient-to-r from-yellow-100 to-amber-50 border-2 border-yellow-400 rounded-xl shadow-hod-md px-6 py-4 text-center font-poppins font-bold text-amber-900 backdrop-blur-sm";

  return (
    <div className={classNames}>
      <div className="flex items-center justify-center gap-2">
        <span className="text-3xl">⭐</span>
        <span>
          #{highlightIndex + 1} – {highlightRow[columnNames[0]]} –{" "}
          {highlightRow[columnNames[1]]}
        </span>
      </div>
    </div>
  );
}

export { HighlightRow };
