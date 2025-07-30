import { useEffect, useState } from "react";
import RankingTable from "./components/RankingTable";
import SearchBar from "./components/SearchBar";

export default function App() {
  const [ranking, setRanking] = useState([]);
  const [, setSearch] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(null);
  const [selectedSheet, setSelectedSheet] = useState("Rubiks1");

  const sheetOptions = [{ name: "Rubiks1", ascending: true }];

  const currentSheet = sheetOptions.find((s) => s.name === selectedSheet);
  const SHEET_URL = `https://gsx2json.com/api?id=1l1qBCg3_K3kUaOC_7il6_pzrH_wm_Wj4CaSxsNGQsfk&sheet=${selectedSheet}&columns=false`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(SHEET_URL);
        const json_data = await response.json();
        const formatted_data = json_data.rows;

        const sorted = [...formatted_data].sort((a, b) => {
          const first = parseFloat(a.Score);
          const second = parseFloat(b.Score);

          return currentSheet?.ascending ? first - second : second - first;
        });

        setRanking(sorted);
      } catch (error) {
        console.error("Fetch error", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [SHEET_URL, currentSheet?.ascending, selectedSheet]);

  const handleSearch = (query) => {
    setSearch(query);

    const index = ranking.findIndex(
      (row) => row.Nom.toLowerCase() === query.toLowerCase()
    );
    setHighlightedIndex(index !== -1 ? index : null);
  };

  const handleSheetChange = (e) => {
    setSelectedSheet(e.target.value);
    setHighlightedIndex(null);
    setSearch("");
  };

  return (
    <div className="min-h-screen p-4 bg-gray-50 text-gray-800 z-5">
      <div className="sticky top-0 bg-gray-50 z-10 p-4 shadow-md rounded-xl">
        <h1 className="text-3xl font-bold text-center mb-6 z-15">
          Classement du Tournoi
        </h1>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4 z-15">
          <SearchBar onSearch={handleSearch} />
          <select
            value={selectedSheet}
            onChange={handleSheetChange}
            className="p-2 border rounded-md"
          >
            {sheetOptions.map((sheet) => (
              <option key={sheet.name} value={sheet.name}>
                {sheet.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <RankingTable
          data={ranking}
          highlightIndex={highlightedIndex}
          ascending={currentSheet?.ascending}
        />
      </div>
    </div>
  );
}
