function Row({ enchanted, index, value }) {
    const classNames = `relative border px-4 py-2 z-7 ${enchanted ? "enchanted-text" : ""}`;
    return (<td className={classNames} style={enchanted ? { animationDelay: `${index * 0.05}s` } : undefined}>
      {value}
    </td>);
}
function RowPlace({ enchanted, index }) {
    const value = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : index + 1;
    return <Row enchanted={enchanted} index={index} value={value}/>;
}
function RowName({ enchanted, index, row }) {
    return <Row enchanted={enchanted} index={index} value={row.Nom}/>;
}
function RowScore({ enchanted, index, row }) {
    return <Row enchanted={enchanted} index={index} value={row.Score}/>;
}
export { RowPlace, RowName, RowScore };
