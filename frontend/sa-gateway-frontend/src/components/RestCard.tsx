import { FaServer, FaShoppingCart } from 'react-icons/fa';

interface RestCardProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  orders?: any[];
}

export default function RestCard({ orders }: RestCardProps) {
  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <FaServer className="text-blue-600" />
          <span className="font-medium text-blue-900">REST-Architektur</span>
        </div>
        <p className="text-sm text-blue-800">
          Stateless HTTP-Protokoll mit standardisierten Methoden (GET, POST, PUT, DELETE).
          Einfach zu implementieren und weit verbreitet.
        </p>
      </div>
      
      {orders && orders.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <FaShoppingCart className="text-green-600 text-sm" />
            <span className="font-medium text-green-900 text-sm">Bestellungen verfügbar</span>
            <span className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
              {orders.length}
            </span>
          </div>
        </div>
      )}
    </div>
  );
} 