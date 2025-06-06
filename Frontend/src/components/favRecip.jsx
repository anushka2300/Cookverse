import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ChefHat } from 'lucide-react';
import Navbar from './navbar';

const FavRecip = () => {
    const { userId, dishId } = useParams();
    const [result, setResult] = useState(null);

    const getRec = async () => {
        try {
            const res = await fetch(`http://localhost:3000/dish/get/${userId}/${dishId}`, {
                method: 'GET'
            });
            const data = await res.json();

            setResult(data.data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getRec();
    }, []);

    if (!result) {
        return (
            <div className="text-center mt-10 text-gray-600">
                Loading recipe...
            </div>
        );
    }

    return (
       <>
       
        <div className="max-w-4xl mx-auto px-4 py-10">
           
            <div className="text-center mb-10">
                <h2 className="text-4xl font-bold text-gray-800 mb-3 flex items-center justify-center gap-3">
                    <ChefHat className="w-10 h-10 text-orange-500" />
                    🍽 {result.strMeal}
                </h2>
                <img
                    src={result.strMealThumb}
                    alt={result.strMeal}
                    className="rounded-xl mx-auto w-64 h-64 object-cover shadow-lg"
                />
                <p className="text-gray-600 mt-4">Servings: {result.servings}</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
               
                <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <span className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                            🥘
                        </span>
                        Ingredients
                    </h3>
                    <ul className="space-y-3">
                        {result.ingredients?.map((ingredient, index) => (
                            <li key={index} className="flex items-center gap-3 text-gray-700">
                                <span className="w-2 h-2 bg-orange-400 rounded-full flex-shrink-0"></span>
                                <span className="text-lg">
                                    {ingredient.name}{ingredient.quantity ? ` - ${ingredient.quantity}` : ''}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
 
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <span className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                            📝
                        </span>
                        Instructions
                    </h3>
                    <ol className="space-y-4">
                        {result.steps?.map((step, index) => (
                            <li key={index} className="flex gap-4 text-gray-700">
                                <span className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                                    {index + 1}
                                </span>
                                <span className="text-lg leading-relaxed">{step}</span>
                            </li>
                        ))}
                    </ol>
                </div>
            </div>
        </div>
        </>
    );
};

export default FavRecip;
