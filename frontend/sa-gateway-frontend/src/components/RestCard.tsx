import { FaServer } from 'react-icons/fa';

export default function RestCard() {
  return (
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
  );
} 