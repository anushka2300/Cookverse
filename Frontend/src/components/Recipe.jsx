import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ChefHat, Loader2 } from 'lucide-react';
import Navbar from './navbar';
const Recipe = () => {
    const { id } = useParams();
    const [result, setResult] = useState();
    const [loading, setLoading] = useState(true);

    const handleplatter = async (id) => {
        try {
            setLoading(true);
            const res = await fetch(`https://cookverse.onrender.com/dish/generateRecipeName`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id }),
            });
            const data = await res.json();
            console.log(data);
            if (data) {
                setResult(data.recipe);
            } else {
                console.error(data.error);
                alert('Failed to generate recipe');
            }
        } catch (err) {
            console.error(err);
            alert('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        handleplatter(id);
    }, [id]);

    const LoadingPage = () => (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50">
            <div className="text-center">
                <div className="relative mb-8">
                    <div className="w-24 h-24 mx-auto mb-6 relative">
                        <ChefHat className="w-24 h-24 text-orange-500 animate-bounce" />
                        <Loader2 className="w-8 h-8 text-orange-600 animate-spin absolute -bottom-2 -right-2" />
                    </div>
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                    Cooking up your recipe...
                </h2>
                <div className="flex justify-center items-center gap-2 mb-6">
                    <div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>
                    <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
                <p className="text-gray-600 text-lg max-w-md mx-auto">
                    Our AI chef is preparing a delicious recipe just for you. This might take a few moments...
                </p>
                <div className="mt-8 flex justify-center">
                    <div className="bg-white rounded-full px-6 py-3 shadow-lg">
                        <div className="flex items-center gap-3">
                            <div className="w-6 h-6 border-3 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
                            <span className="text-gray-700 font-medium">Generating recipe...</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    if (loading) return <LoadingPage />;

    return (
        <>
            {result && (
                <div className="max-w-4xl mx-auto px-4 py-10">
                    <div className="text-center mb-10">
                        <h2 className="text-4xl font-bold text-gray-800 mb-3 flex items-center justify-center gap-3">
                            <ChefHat className="w-10 h-10 text-orange-500" />
                            {result.strMeal}
                        </h2>
                        <img
                            src={result.strMealThumb}
                            alt={result.strMeal}
                            className="rounded-xl mx-auto w-64 h-64 object-cover shadow-lg"
                        />
                        <p className="text-gray-600 mt-4">{result.servings}</p>
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
                                {result.ingredients.map((ingredient, index) => (
                                    <li key={index} className="flex items-center gap-3 text-gray-700">
                                        <span className="w-2 h-2 bg-orange-400 rounded-full flex-shrink-0"></span>
                                        <span className="text-lg">
                                            {ingredient.name} - {ingredient.quantity}
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
                                {result.steps.map((step, index) => (
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
            )}
        </>
    );
};

export default Recipe;
