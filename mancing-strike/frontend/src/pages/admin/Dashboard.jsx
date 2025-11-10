import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ShoppingBag, Users, DollarSign } from 'lucide-react';
import { adminAPI } from '../../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await adminAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Produk',
      value: stats?.totalProducts || 0,
      icon: Package,
      color: 'bg-blue-500',
      link: '/admin/products'
    },
    {
      title: 'Total Pesanan',
      value: stats?.totalOrders || 0,
      icon: ShoppingBag,
      color: 'bg-green-500',
      link: '/admin/orders'
    },
    {
      title: 'Pesanan Pending',
      value: stats?.pendingOrders || 0,
      icon: Users,
      color: 'bg-yellow-500',
      link: '/admin/orders?status=pending'
    },
    {
      title: 'Total Revenue',
      value: `Rp ${(stats?.totalRevenue || 0).toLocaleString('id-ID')}`,
      icon: DollarSign,
      color: 'bg-purple-500',
      link: '/admin/orders?status=completed'
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Selamat datang di panel admin Mancing Strike</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, index) => (
          <Link
            key={index}
            to={card.link}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${card.color} p-3 rounded-lg`}>
                <card.icon className="text-white" size={24} />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">{card.title}</h3>
            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              to="/admin/products"
              className="block p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
            >
              <h3 className="font-semibold text-blue-900">Kelola Produk</h3>
              <p className="text-sm text-blue-700">Tambah, edit, atau hapus produk</p>
            </Link>
            <Link
              to="/admin/orders"
              className="block p-4 bg-green-50 rounded-lg hover:bg-green-100 transition"
            >
              <h3 className="font-semibold text-green-900">Kelola Pesanan</h3>
              <p className="text-sm text-green-700">Lihat dan kelola semua pesanan</p>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Status Pesanan</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
              <span className="font-medium text-yellow-900">Pending</span>
              <span className="text-2xl font-bold text-yellow-600">
                {stats?.pendingOrders || 0}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="font-medium text-green-900">Completed</span>
              <span className="text-2xl font-bold text-green-600">
                {stats?.completedOrders || 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;