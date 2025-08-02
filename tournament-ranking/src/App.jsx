import { useEffect, useState } from "react";
import RankingTable from "./components/RankingTable";
import SearchBar from "./components/SearchBar";

export default function App() {
  const [ranking, setRanking] = useState([]);
  const [, setSearch] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(null);
  const [selectedSheet, setSelectedSheet] = useState("Rubiks1");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [retryTrigger, setRetryTrigger] = useState(0);

  const sheetOptions = [{ name: "Rubiks1", ascending: true }];

  const currentSheet = sheetOptions.find((s) => s.name === selectedSheet);
  const SHEET_URL = `https://gsx2json.com/api?id=1l1qBCg3_K3kUaOC_7il6_pzrH_wm_Wj4CaSxsNGQsfk&sheet=${selectedSheet}&columns=false`;

  useEffect(() => {
    const fetchData = async (attempt = 1) => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(SHEET_URL);
        
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status} - ${response.statusText}`);
        }
        
        const json_data = await response.json();
        
        if (!json_data.rows || !Array.isArray(json_data.rows)) {
          throw new Error("Format de données invalide reçu du serveur");
        }
        
        const formatted_data = json_data.rows;

        const sorted = [...formatted_data].sort((a, b) => {
          const first = parseFloat(a.Score);
          const second = parseFloat(b.Score);

          return currentSheet?.ascending ? first - second : second - first;
        });

        setRanking(sorted);
        setRetryCount(0);
        setError(null);
      } catch (error) {
        console.error("Fetch error", error);
        
        let errorMessage = "Erreur de connexion réseau";
        
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
          errorMessage = "Impossible de se connecter au serveur. Vérifiez votre connexion internet.";
        } else if (error.message.includes('HTTP: 429')) {
          errorMessage = "Limite de requêtes dépassée. Veuillez patienter avant de réessayer.";
        } else if (error.message.includes('HTTP: 404')) {
          errorMessage = "Données non trouvées. La feuille sélectionnée n'existe peut-être pas.";
        } else if (error.message.includes('HTTP: 500')) {
          errorMessage = "Erreur du serveur. Veuillez réessayer plus tard.";
        } else if (error.message.includes('Format de données invalide')) {
          errorMessage = error.message;
        }
        
        setError({
          message: errorMessage,
          canRetry: attempt < 3,
          technical: error.message
        });
        
        // Auto-retry for certain errors
        if (attempt < 3 && !error.message.includes('HTTP: 429')) {
          setTimeout(() => {
            setRetryCount(attempt);
            fetchData(attempt + 1);
          }, Math.pow(2, attempt) * 1000); // Exponential backoff
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(() => fetchData(), 30000);
    return () => clearInterval(interval);
  }, [SHEET_URL, currentSheet?.ascending, selectedSheet, retryTrigger]);

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
    setError(null);
  };

  const handleRetry = () => {
    setError(null);
    setRetryCount(0);
    setRetryTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen p-4 bg-gray-50 text-gray-800 z-5">
      <div className="sticky top-0 bg-gray-50 z-10 p-4 shadow-md rounded-xl">
        <h1 className="text-3xl font-bold text-center mb-6 z-15">
          Classement du Tournoi
          {loading && (
            <span className="ml-2 text-sm text-blue-600">
              Chargement...
            </span>
          )}
        </h1>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4 z-15">
          <SearchBar onSearch={handleSearch} />
          <select
            value={selectedSheet}
            onChange={handleSheetChange}
            className="p-2 border rounded-md"
            disabled={loading}
          >
            {sheetOptions.map((sheet) => (
              <option key={sheet.name} value={sheet.name}>
                {sheet.name}
              </option>
            ))}
          </select>
        </div>
        
        {error && (
          <div className="max-w-2xl mx-auto mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-red-800 font-semibold">
                  Erreur de chargement
                </h3>
                <p className="text-red-700 mt-1">{error.message}</p>
                {retryCount > 0 && (
                  <p className="text-red-600 text-sm mt-1">
                    Tentative {retryCount}/3...
                  </p>
                )}
              </div>
              {error.canRetry && (
                <button
                  onClick={handleRetry}
                  className="ml-4 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                  disabled={loading}
                >
                  Réessayer
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <div>
        {loading && ranking.length === 0 ? (
          <div className="max-w-2xl mx-auto text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des données...</p>
          </div>
        ) : (
          <RankingTable
            data={ranking}
            highlightIndex={highlightedIndex}
            ascending={currentSheet?.ascending}
          />
        )}
      </div>
    </div>
  );
}
