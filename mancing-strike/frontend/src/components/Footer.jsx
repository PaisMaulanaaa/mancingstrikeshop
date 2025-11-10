const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-3xl">🎣</span>
              <span className="text-xl font-bold">Mancing Strike</span>
            </div>
            <p className="text-gray-400">
              Toko alat pancing terlengkap dengan harga terjangkau.
              Solusi untuk hobi memancing Anda.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-400 hover:text-white transition">
                  Home
                </a>
              </li>
              <li>
                <a href="/products" className="text-gray-400 hover:text-white transition">
                  Produk
                </a>
              </li>
              <li>
                <a href="/cart" className="text-gray-400 hover:text-white transition">
                  Keranjang
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Kontak</h3>
            <ul className="space-y-2 text-gray-400">
              <li>📧 info@mancingstrike.com</li>
              <li>📱 +62 812-3456-7890</li>
              <li>📍 Jakarta, Indonesia</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Mancing Strike. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;  