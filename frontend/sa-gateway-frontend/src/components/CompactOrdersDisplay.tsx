import { FaShoppingCart, FaUser, FaCalendar, FaBox } from 'react-icons/fa';

interface Order {
  id: string | number;
  product: string;
  quantity: number;
  createdAt?: string;
  userName?: string;
  userEmail?: string;
  user?: {
    id: string | number;
    name: string;
    email: string;
  };
}

interface CompactOrdersDisplayProps {
  orders: Order[];
  title?: string;
  showUserInfo?: boolean;
  maxDisplay?: number;
}

export default function CompactOrdersDisplay({ 
  orders, 
  title = "Bestellungen", 
  showUserInfo = false,
  maxDisplay = 5 
}: CompactOrdersDisplayProps) {
  if (!orders || orders.length === 0) {
    return null; // Keine Anzeige wenn keine Orders
  }

  const displayOrders = orders.slice(0, maxDisplay);
  const hasMore = orders.length > maxDisplay;

  // Gruppiere nach User für bessere Übersicht
  const groupedByUser = showUserInfo ? 
    displayOrders.reduce((acc, order) => {
      const userName = order.userName || order.user?.name || 'Unbekannt';
      if (!acc[userName]) acc[userName] = [];
      acc[userName].push(order);
      return acc;
    }, {} as Record<string, Order[]>) : 
    { 'Bestellungen': displayOrders };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <FaShoppingCart className="text-blue-600" />
          <span className="font-medium text-blue-900 text-sm">{title}</span>
        </div>
        <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
          {orders.length} Bestellung{orders.length !== 1 ? 'en' : ''}
        </span>
      </div>

      <div className="space-y-2">
        {Object.entries(groupedByUser).map(([userName, userOrders]) => (
          <div key={userName} className="space-y-1">
            {showUserInfo && Object.keys(groupedByUser).length > 1 && (
              <div className="flex items-center gap-1 text-xs text-gray-600 font-medium">
                <FaUser className="text-gray-400" />
                <span>{userName}</span>
              </div>
            )}
            
            <div className="grid gap-1">
              {userOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between bg-white rounded px-3 py-2 shadow-sm">
                  <div className="flex items-center gap-2">
                    <FaBox className="text-green-500 text-xs" />
                    <span className="text-sm font-medium text-gray-800">{order.product}</span>
                    <span className="bg-blue-100 text-blue-700 text-xs px-1.5 py-0.5 rounded font-medium">
                      {order.quantity}x
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    {order.createdAt && (
                      <span>{new Date(order.createdAt).toLocaleDateString('de-DE')}</span>
                    )}
                    <span className="text-gray-400">#{order.id}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="mt-2 text-center">
          <span className="text-xs text-gray-500">
            +{orders.length - maxDisplay} weitere Bestellung{orders.length - maxDisplay !== 1 ? 'en' : ''}
          </span>
        </div>
      )}
    </div>
  );
} 