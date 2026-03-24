import { useEffect, useState, ChangeEvent } from "react";
import RankingTable from "./components/RankingTable";
import SearchBar from "./components/SearchBar";

interface SheetOption {
  name: string;
  ascending: boolean | boolean[];
}

interface RankingRow {
  [key: string]: string | number;
}

interface ApiResponse {
  rows: RankingRow[];
}

export default function App() {
  const [ranking, setRanking] = useState<RankingRow[]>([]);
  const [, setSearch] = useState<string>("");
  const [showExtraColumns, setShowExtraColumns] = useState<boolean>(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const [columnNames, setColumnNames] = useState<[string, string]>([
    "Nom",
    "Score",
  ]);

  // open file sheet-options.json and parse it as SheetOption[]
  const sheetOptions: SheetOption[] = require("./sheet-options.json");
  const [selectedSheet, setSelectedSheet] = useState<string>(
    sheetOptions[0]?.name || "",
  );

  const currentSheet = sheetOptions.find((s) => s.name === selectedSheet);
  const topAscending: boolean = Array.isArray(currentSheet?.ascending)
    ? currentSheet!.ascending[0]
    : (currentSheet?.ascending ?? true);
  const SHEET_URL = `https://gsx2json.com/api?id=1l1qBCg3_K3kUaOC_7il6_pzrH_wm_Wj4CaSxsNGQsfk&sheet=${selectedSheet}&columns=false`;
  const scoreColumnName = columnNames[1];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(SHEET_URL);
        const json_data: ApiResponse = await response.json();
        const formatted_data = json_data.rows;

        if (formatted_data.length > 0) {
          const keys = Object.keys(formatted_data[0]);
          if (keys.length >= 2) {
            setColumnNames([keys[0], keys[1]]);
          }
        }

        const rawAsc = currentSheet?.ascending;
        const ascArray: boolean[] = Array.isArray(rawAsc)
          ? rawAsc
          : typeof rawAsc === "boolean"
            ? [rawAsc]
            : [true];

        const keys =
          formatted_data.length > 0 ? Object.keys(formatted_data[0]) : [];

        const sorted = [...formatted_data].sort((a, b) => {
          for (let i = 0; i < ascArray.length; i++) {
            const key = keys[i + 1];
            if (!key) continue;

            const aRaw = a[key];
            const bRaw = b[key];

            const aNum = parseFloat(String(aRaw).replace(",", "."));
            const bNum = parseFloat(String(bRaw).replace(",", "."));

            if (!isNaN(aNum) && !isNaN(bNum)) {
              const diff = aNum - bNum;
              if (diff !== 0) return ascArray[i] ? diff : -diff;
            } else {
              const aStr = String(aRaw).toLowerCase();
              const bStr = String(bRaw).toLowerCase();
              if (aStr !== bStr)
                return ascArray[i]
                  ? aStr.localeCompare(bStr)
                  : bStr.localeCompare(aStr);
            }
          }

          return 0;
        });

        setRanking(sorted);
      } catch (error) {
        console.error("Fetch error", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [SHEET_URL, selectedSheet, scoreColumnName, currentSheet?.ascending]);

  const handleSearch = (query: string) => {
    setSearch(query);

    const index = ranking.findIndex(
      (row) =>
        String(row[columnNames[0]]).toLowerCase() === query.toLowerCase(),
    );
    setHighlightedIndex(index !== -1 ? index : null);
  };

  const handleSheetChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedSheet(e.target.value);
    setHighlightedIndex(null);
    setSearch("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="hod-header sticky top-0 z-50 py-6 px-4 shadow-xl">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="hod-title text-5xl mb-2">🎲 Heaven of Dice</h1>
            <p className="text-violet-100 text-lg font-medium">
              Classement des Tournois
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="w-full sm:w-auto">
              <SearchBar onSearch={handleSearch} />
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowExtraColumns((s) => !s)}
                aria-pressed={showExtraColumns}
                className={`hod-select inline-flex items-center gap-3 ${"text-gray-800 font-medium"}`}
              >
                <span
                  className={`flex items-center justify-center w-5 h-5 rounded-sm border transition-colors duration-150 ${
                    showExtraColumns
                      ? "bg-violet-600 border-violet-600 text-white"
                      : "bg-white border-violet-200 text-transparent"
                  }`}
                >
                  ✓
                </span>
                <span className="text-sm">Afficher colonnes</span>
              </button>
              <select
                value={selectedSheet}
                onChange={handleSheetChange}
                className="hod-select w-full sm:w-auto text-gray-800 font-medium"
              >
                {sheetOptions.map((sheet) => (
                  <option key={sheet.name} value={sheet.name}>
                    📋 {sheet.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-center">
          <RankingTable
            data={ranking}
            highlightIndex={highlightedIndex}
            ascending={topAscending}
            columnNames={columnNames}
            showExtraColumns={showExtraColumns}
          />
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center">
          <p className="text-slate-600 text-sm">
            ✨ Classement mis à jour automatiquement toutes les 30 secondes ✨
          </p>
        </div>
      </div>
    </div>
  );
}
