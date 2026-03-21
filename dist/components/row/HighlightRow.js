function HighlightRow({ highlightIndex, highlightRow }) {
    const classNames = "fixed left-4 right-4 z-20 bottom-0 bg-yellow-100 border border-yellow-300 rounded-md shadow-md px-4 py-2 text-center font-bold";
    return (<div className={classNames}>
      #{highlightIndex + 1} – {highlightRow.Nom} – {highlightRow.Score}
    </div>);
}
export { HighlightRow };
