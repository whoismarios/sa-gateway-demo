import { FaServer, FaCodeBranch } from 'react-icons/fa';

export default function ProtocolComparison() {
  return (
    <div className="mt-12 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-8">
      <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Protokoll-Vergleich im Detail</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
          <FaServer className="text-blue-600 text-3xl mx-auto mb-4" />
          <h4 className="font-bold text-blue-900 text-lg mb-2">REST</h4>
          <p className="text-sm text-blue-700 mb-3">HTTP-basiert, JSON, weit verbreitet</p>
          <div className="space-y-2 text-xs text-blue-600">
            <div className="flex justify-between">
              <span>Performance:</span>
              <span className="font-medium">⭐⭐⭐</span>
            </div>
            <div className="flex justify-between">
              <span>Einfachheit:</span>
              <span className="font-medium">⭐⭐⭐⭐⭐</span>
            </div>
            <div className="flex justify-between">
              <span>Flexibilität:</span>
              <span className="font-medium">⭐⭐⭐</span>
            </div>
          </div>
        </div>

        <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
          <FaCodeBranch className="text-purple-600 text-3xl mx-auto mb-4" />
          <h4 className="font-bold text-purple-900 text-lg mb-2">GraphQL</h4>
          <p className="text-sm text-purple-700 mb-3">Flexible Queries, Single Endpoint</p>
          <div className="space-y-2 text-xs text-purple-600">
            <div className="flex justify-between">
              <span>Performance:</span>
              <span className="font-medium">⭐⭐⭐⭐</span>
            </div>
            <div className="flex justify-between">
              <span>Einfachheit:</span>
              <span className="font-medium">⭐⭐⭐</span>
            </div>
            <div className="flex justify-between">
              <span>Flexibilität:</span>
              <span className="font-medium">⭐⭐⭐⭐⭐</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Note about gRPC */}
      <div className="mt-8 p-6 bg-gray-50 border border-gray-200 rounded-xl">
        <h4 className="font-semibold text-gray-800 mb-2">Hinweis zu gRPC</h4>
        <p className="text-sm text-gray-600">
          gRPC ist ein hochperformantes RPC-Framework, das Protocol Buffers verwendet. 
          Es ist ideal für Service-zu-Service Kommunikation, wird aber von Browsern nicht nativ unterstützt. 
          Daher wurde es aus dieser Demo entfernt, um nur echte, funktionsfähige API-Protokolle zu zeigen.
        </p>
      </div>
    </div>
  );
} 