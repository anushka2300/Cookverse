import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Trash2 } from 'lucide-react';
import Navbar from './navbar';
const SavedDish = () => {
     const [user,setUser]=useState(null);
     const [favorites, setFavorites] = useState([]);
    
     const navigate = useNavigate();
  

    const getData=async ()=>{
          const id=user._id
        try{
            const res=await fetch(`http://localhost:3000/dish/save/${id}`,{
                method:'GET'
            })
            const data=await res.json();
            console.log(data.data);
            setFavorites(data.data)
        }
        catch(err){
        console.log(err);
        }
    }

 const removeFavorite = async (dishId) => {
  try {
    const res = await fetch(`http://localhost:3000/dish/remove/${user._id}/${dishId}`, {
      method: 'DELETE'
    });
    const data = await res.json();
    console.log(data);

    if (res.ok) {
      setFavorites(prev => prev.filter(dish => dish._id !== dishId));
      alert("Deleted from favorites");
    } else {
      alert(data.message || "Failed to delete");
    }
  } catch (err) {
    console.log("Not deleted", err);
    alert("Server error while deleting");
  }
};



   
    const handleBackToHome=()=>{
        navigate('/')
    }
      const getUser=async ()=>{
       const res=await fetch('http://localhost:3000/auth/user',{
          method:'GET',
           credentials: 'include',
       })
       const data=await res.json();
       setUser(data);
      
    }

    const handleRecipe=(dishid)=>{
      navigate(`/recipe/${user._id}/${dishid}`)
    }

    useEffect(()=>{
        getUser();
    },[])

     useEffect(() => {
    if (user && user._id) {
      getData(user._id);
    }
  }, [user]);

    

     
  return (
  
    <div> 
      
         <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50">
     
      <div className="relative overflow-hidden bg-gradient-to-r from-pink-600 via-red-600 to-orange-600 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative container mx-auto px-6 py-20 text-center">
          <div className="flex items-center justify-center mb-6">
            <Heart className="w-12 h-12 text-red-300 mr-4 animate-pulse" />
            <h1 className="text-5xl md:text-6xl font-bold">
              My
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent"> Favorites</span>
            </h1>
          </div>
          <p className="text-lg md:text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Your personal collection of beloved dishes, saved for those special moments
          </p>
          <button 
            onClick={handleBackToHome}
            className="bg-white cursor-pointer text-gray-800 px-6 py-3 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all duration-300 shadow-xl hover:shadow-2xl"
          >
            Back to Home
          </button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-50 to-transparent"></div>
      </div>

     
      <div className="container mx-auto px-6 py-16">
        {favorites.length === 0 ? (
       
          <div className="text-center py-20">
            <div className="mb-8">
             
              <h2 className="text-3xl font-bold text-gray-600 mb-4">No Favorites Yet</h2>
              <p className="text-xl text-gray-500 max-w-md mx-auto mb-8">
                Start exploring our delicious dishes and add them to your favorites to see them here!
              </p>
              <button 
                onClick={handleBackToHome}
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg transform hover:scale-105"
              >
                Discover Dishes
              </button>
            </div>
          </div>
        ) : (
          <>
            
            <div className="text-center mb-12">
              
              <p className="text-lg text-gray-600">
                Your carefully curated collection of culinary masterpieces
              </p>
            </div>

         
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {favorites.map((dish) => (
                <div
                  key={dish._id}
                  className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transform   transition-all duration-500 overflow-hidden"
                >
                
                  <div className="relative overflow-hidden rounded-t-3xl">
                    <img
                      src={dish.strMealThumb}
                      alt={dish.strMeal}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                 
                    <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={() => removeFavorite(dish._id)}
                        className="bg-red-600 hover:bg-red-700 rounded-full p-2 shadow-lg transition-colors duration-200"
                        title="Remove from favorites"
                      >
                        <Trash2 className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </div>

                 
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-orange-600 transition-colors duration-300">
                      {dish.strMeal}
                    </h3>
                    
                    
                 
 
                    <button 
                      onClick={() => handleRecipe(dish._id)}
                      className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                    >
                      View Recipe
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      
      {favorites  && (
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Cook Something Amazing?</h2>
            <p className="text-lg mb-8 opacity-90 max-w-xl mx-auto">
              Pick one of your favorite recipes and start cooking your next masterpiece
            </p>
            <button 
              onClick={handleBackToHome}
              className="bg-orange-600 hover:bg-orange-700 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-xl"
            >
              Discover More Recipes
            </button>
          </div>
        </div>
      )}
    </div>

    </div>
  )
}

export default SavedDish