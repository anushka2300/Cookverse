import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from './navbar';
import Footer from './footer';

const HomePage = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('query')?.toLowerCase() || '';

  const handlePlatter = (id) => {
    navigate(`/${id}`);
  };

  const getDish = async () => {
    try {
      const res = await fetch(`https://cookverse.onrender.com/dish/getDish`);
      const output = await res.json();
      let dishes = output.data;

      if (searchQuery) {
        dishes = dishes.filter((dish) =>
          dish.strMeal.toLowerCase().includes(searchQuery)
        );
      }

      setData(dishes);
    } catch (err) {
      console.log('error in fetching');
    }
  };

  const handleClick = () => {
    navigate('/generateRecipe');
  };

  useEffect(() => {
    getDish();
  }, [searchQuery]);

  return (
    <>
   
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50">
        <div className="relative overflow-hidden bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 text-white">
          <div className="absolute inset-0 bg-black opacity-20"></div>
          <div className="relative container mx-auto px-6 py-24 text-center">
            <h1 className="text-6xl md:text-7xl font-bold mb-6 animate-pulse">
              Culinary{' '}
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Excellence
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
              Discover extraordinary flavors crafted by world-class chefs. Each
              dish tells a story of passion, tradition, and innovation.
            </p>
            <button
              onClick={handleClick}
              className="bg-white text-gray-800 px-8 py-4 rounded-full text-lg cursor-pointer font-semibold hover:bg-gray-100 transition-all duration-300 shadow-xl hover:shadow-2xl"
            >
              Get Recipe
            </button>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-50 to-transparent"></div>
        </div>

        <div className="container mx-auto px-6 py-16">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-800 mb-4">
              {searchQuery
                ? `Search results for "${searchQuery}"`
                : 'Signature Creations'}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience our carefully curated selection of masterfully prepared
              dishes
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {data.map((dish) => (
              <div
                key={dish._id}
                className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transform transition-all duration-500 overflow-hidden cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-t-3xl">
                  <img
                    src={dish.strMealThumb}
                    alt={dish.strMeal}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-orange-600 transition-colors duration-300">
                    {dish.strMeal}
                  </h3>
                  <button
                    onClick={() => handlePlatter(dish._id)}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg"
                  >
                    Recipe
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default HomePage;
