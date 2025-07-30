export default function SearchBar({ onSearch }) {
  return (
    <div className="text-center">
      <input
        type="text"
        placeholder="Rechercher un nom..."
        onChange={(e) => onSearch(e.target.value)}
        className="border px-3 py-2 rounded shadow-sm w-64"
      />
    </div>
  );
}
