// src/pages/Checkout.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ordersAPI } from '../services/api';
import { CreditCard, MapPin, Package } from 'lucide-react';

const Checkout = () => {
  const { cart, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    notes: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Format alamat lengkap
      const shippingAddress = `${formData.fullName}, ${formData.phone}
${formData.address}
${formData.city}, ${formData.postalCode}
${formData.notes ? 'Catatan: ' + formData.notes : ''}`;

      const orderData = {
        items: cart.map(item => ({
          productId: item.id,
          quantity: item.quantity,
        })),
        shippingAddress: shippingAddress.trim(),
      };

      await ordersAPI.create(orderData);
      clearCart();
      alert('🎉 Pesanan berhasil dibuat! Terima kasih sudah berbelanja.');
      navigate('/orders');
    } catch (error) {
      console.error('Checkout error:', error);
      alert('❌ Error: ' + (error.response?.data?.message || 'Terjadi kesalahan saat checkout'));
    } finally {
      setLoading(false);
    }
  };

  // Redirect jika cart kosong
  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Checkout */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Informasi Penerima */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center gap-2 mb-6">
                  <MapPin className="text-primary" size={24} />
                  <h2 className="text-xl font-bold text-gray-900">Informasi Penerima</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Lengkap <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Masukkan nama lengkap"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nomor Telepon <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="08123456789"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Alamat Lengkap <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="address"
                      required
                      rows="3"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Jalan, No. Rumah, RT/RW, Kelurahan, Kecamatan"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kota <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Jakarta"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kode Pos <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      required
                      value={formData.postalCode}
                      onChange={handleChange}
                      placeholder="12345"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Catatan untuk Kurir (Opsional)
                    </label>
                    <textarea
                      name="notes"
                      rows="2"
                      value={formData.notes}
                      onChange={handleChange}
                      placeholder="Contoh: Rumah cat hijau, depan alfamart"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Metode Pembayaran */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center gap-2 mb-6">
                  <CreditCard className="text-primary" size={24} />
                  <h2 className="text-xl font-bold text-gray-900">Metode Pembayaran</h2>
                </div>

                <div className="space-y-3">
                  <div className="border-2 border-primary bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        value="cod"
                        defaultChecked
                        className="w-4 h-4 text-primary"
                      />
                      <div>
                        <p className="font-semibold text-gray-900">Cash on Delivery (COD)</p>
                        <p className="text-sm text-gray-600">Bayar saat barang tiba</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-2 border-gray-200 rounded-lg p-4 opacity-50">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        value="transfer"
                        disabled
                        className="w-4 h-4"
                      />
                      <div>
                        <p className="font-semibold text-gray-600">Transfer Bank</p>
                        <p className="text-sm text-gray-500">Segera hadir</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Button Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-primary text-white font-bold text-lg rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Memproses...
                  </span>
                ) : (
                  `Buat Pesanan - Rp ${getTotalPrice().toLocaleString('id-ID')}`
                )}
              </button>
            </form>
          </div>

          {/* Ringkasan Pesanan */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                <Package className="text-primary" size={24} />
                <h2 className="text-xl font-bold text-gray-900">Ringkasan Pesanan</h2>
              </div>

              <div className="space-y-4 mb-6">
                {cart.map(item => (
                  <div key={item.id} className="flex gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm line-clamp-2">
                        {item.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {item.quantity} x Rp {item.price.toLocaleString('id-ID')}
                      </p>
                      <p className="text-sm font-semibold text-primary">
                        Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2 mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cart.length} item)</span>
                  <span className="font-semibold">
                    Rp {getTotalPrice().toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Biaya Pengiriman</span>
                  <span className="font-semibold text-green-600">GRATIS</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Biaya Admin</span>
                  <span className="font-semibold">Rp 0</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total Pembayaran</span>
                  <span className="text-2xl font-bold text-primary">
                    Rp {getTotalPrice().toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">💡 Catatan:</span> Pesanan akan diproses setelah Anda klik tombol "Buat Pesanan". Pastikan data yang Anda masukkan sudah benar.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;