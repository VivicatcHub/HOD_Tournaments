interface SearchBarProps {
  onSearch: (value: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  return (
    <div className="w-full">
      <input
        type="text"
        placeholder="🔍 Chercher un participant..."
        onChange={(e) => onSearch(e.target.value)}
        className="hod-input w-full text-gray-800 placeholder-gray-500 font-medium shadow-md focus:shadow-lg"
      />
    </div>
  );
}
