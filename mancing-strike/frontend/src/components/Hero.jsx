import { Link, useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  const handleProductsClick = (e) => {
    e.preventDefault();
    console.log('Navigating to /products');
    navigate('/products');
  };

  const handleRegisterClick = (e) => {
    e.preventDefault();
    console.log('Navigating to /register');
    navigate('/register');
  };

  return (
    <div className="relative bg-gradient-to-r from-blue-600 to-cyan-500 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
            🎣 Mancing Strike
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Toko Alat Pancing Terlengkap & Terpercaya
          </p>
          <p className="text-lg mb-10 max-w-2xl mx-auto">
            Temukan berbagai peralatan mancing berkualitas tinggi untuk pengalaman
            memancing yang lebih menyenangkan. Dari joran hingga umpan, semuanya ada di sini!
          </p>
          <div className="flex justify-center gap-4 relative z-20">
            <button
              onClick={handleProductsClick}
              className="inline-block px-8 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-gray-100 transition transform hover:scale-105 cursor-pointer"
            >
              Lihat Produk
            </button>
            <button
              onClick={handleRegisterClick}
              className="inline-block px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-primary transition transform hover:scale-105 cursor-pointer"
            >
              Daftar Sekarang
            </button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
        </svg>
      </div>
    </div>
  );
};

export default Hero;