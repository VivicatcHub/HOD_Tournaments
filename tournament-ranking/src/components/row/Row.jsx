function RowPlace({ enchanted, index }) {
  return (
    <td
      className={`relative border px-4 py-2 z-7 ${
        enchanted ? "enchanted-text" : ""
      }`}
      style={enchanted ? { animationDelay: `${index * 0.05}s` } : undefined}
    >
      {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : index + 1}
    </td>
  );
}

function RowName({ enchanted, index, row }) {
  return (
    <td
      className={`relative border px-4 py-2 z-7 ${
        enchanted ? "enchanted-text" : ""
      }`}
      style={enchanted ? { animationDelay: `${index * 0.05}s` } : undefined}
    >
      {row.Nom}
    </td>
  );
}

function RowScore({ enchanted, index, row }) {
  return (
    <td
      className={`relative border px-4 py-2 z-7 ${
        enchanted ? "enchanted-text" : ""
      }`}
      style={enchanted ? { animationDelay: `${index * 0.05}s` } : undefined}
    >
      {row.Score}
    </td>
  );
}

export { RowPlace, RowName, RowScore };
