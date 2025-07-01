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

interface OrdersDisplayProps {
  orders: Order[];
  title?: string;
  showUserInfo?: boolean;
}

export default function OrdersDisplay({ orders, title = "Bestellungen", showUserInfo = false }: OrdersDisplayProps) {
  if (!orders || orders.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500">
        <FaShoppingCart className="mx-auto text-3xl mb-3 text-gray-300" />
        <p className="text-sm">Keine Bestellungen gefunden</p>
      </div>
    );
  }

  // Gruppiere Orders nach User (falls showUserInfo aktiviert)
  const groupedOrders = showUserInfo ? 
    orders.reduce((acc, order) => {
      const userName = order.userName || order.user?.name || 'Unbekannt';
      if (!acc[userName]) acc[userName] = [];
      acc[userName].push(order);
      return acc;
    }, {} as Record<string, Order[]>) : 
    { 'Alle Bestellungen': orders };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-base font-semibold text-gray-800 border-b border-gray-200 pb-2">
        <FaShoppingCart className="text-blue-500" />
        <span>{title}</span>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
          {orders.length} Bestellung{orders.length !== 1 ? 'en' : ''}
        </span>
      </div>
      
      <div className="space-y-3">
        {Object.entries(groupedOrders).map(([userName, userOrders]) => (
          <div key={userName} className="bg-gray-50 rounded-lg p-3">
            {showUserInfo && Object.keys(groupedOrders).length > 1 && (
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-200">
                <FaUser className="text-gray-500 text-sm" />
                <span className="font-medium text-gray-700 text-sm">{userName}</span>
                <span className="text-xs text-gray-500">
                  ({userOrders.length} Bestellung{userOrders.length !== 1 ? 'en' : ''})
                </span>
              </div>
            )}
            
            <div className="grid gap-2">
              {userOrders.map((order) => (
                <div key={order.id} className="bg-white border border-gray-200 rounded-md p-3 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="flex items-center gap-2">
                        <FaBox className="text-green-500 text-sm" />
                        <span className="font-medium text-gray-900 text-sm">{order.product}</span>
                      </div>
                      <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-medium">
                        {order.quantity}x
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      {order.createdAt && (
                        <div className="flex items-center gap-1">
                          <FaCalendar className="text-gray-400" />
                          <span>{new Date(order.createdAt).toLocaleDateString('de-DE')}</span>
                        </div>
                      )}
                      <span className="text-gray-400">#{order.id}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 