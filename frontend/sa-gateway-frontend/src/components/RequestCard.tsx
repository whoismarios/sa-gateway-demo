import { FaPlay, FaCopy, FaCheck, FaExclamationTriangle } from 'react-icons/fa';

interface ApiResponse {
  data?: any;
  error?: string;
  status?: number;
  timestamp?: string;
}

interface RequestCardProps {
  type: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  endpoint: string;
  onExecute: () => void;
  children?: React.ReactNode;
  results: { [key: string]: ApiResponse };
  loading: { [key: string]: boolean };
  copiedStates: { [key: string]: boolean };
  onCopyToClipboard: (text: string, key: string) => void;
}

export default function RequestCard({
  type,
  title,
  icon,
  color,
  endpoint,
  onExecute,
  children,
  results,
  loading,
  copiedStates,
  onCopyToClipboard
}: RequestCardProps) {
  const isLoading = loading[type];
  const result = results[type];

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      {/* Header */}
      <div className={`p-6 border-b border-gray-100 bg-gradient-to-r ${color} rounded-t-xl`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              {icon}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">{title}</h2>
              <p className="text-white/90 text-sm font-mono bg-white/10 px-2 py-1 rounded mt-1">{endpoint}</p>
            </div>
          </div>
          <button
            onClick={() => onCopyToClipboard(endpoint, `${type}-endpoint`)}
            className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
            title="Endpoint kopieren"
          >
            {copiedStates[`${type}-endpoint`] ? (
              <FaCheck className="text-white text-sm" />
            ) : (
              <FaCopy className="text-white text-sm" />
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {children}

        {/* Execute Button */}
        <button
          onClick={onExecute}
          disabled={isLoading}
          className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-medium transition-all duration-200 ${isLoading
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : `bg-gradient-to-r ${color} text-white hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0`
            }`}
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-300 border-t-gray-600"></div>
              Lädt...
            </>
          ) : (
            <>
              <FaPlay className="text-sm" />
              Anfrage senden
            </>
          )}
        </button>

        {/* Result Display */}
        {result && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-gray-800">Antwort</h4>
              <div className="flex items-center gap-2">
                {result.status && (
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${result.status >= 200 && result.status < 300
                      ? 'bg-green-100 text-green-800 border border-green-200'
                      : 'bg-red-100 text-red-800 border border-red-200'
                    }`}>
                    HTTP {result.status}
                  </span>
                )}
                <button
                  onClick={() => onCopyToClipboard(JSON.stringify(result, null, 2), `${type}-result`)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Ergebnis kopieren"
                >
                  {copiedStates[`${type}-result`] ? (
                    <FaCheck className="text-green-600 text-sm" />
                  ) : (
                    <FaCopy className="text-gray-500 text-sm" />
                  )}
                </button>
              </div>
            </div>

            {result.error ? (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center gap-2 text-red-800 mb-2">
                  <FaExclamationTriangle className="text-sm" />
                  <span className="font-semibold">Fehler aufgetreten</span>
                </div>
                <pre className="text-sm text-red-700 whitespace-pre-wrap">{result.error}</pre>
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <pre className="text-sm text-gray-800 whitespace-pre-wrap overflow-x-auto leading-relaxed">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </div>
            )}

            {result.timestamp && (
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <FaCheck className="text-green-500" />
                Abgeschlossen um {new Date(result.timestamp).toLocaleString('de-DE')}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 