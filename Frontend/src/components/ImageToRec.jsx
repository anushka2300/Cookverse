import { useState, useRef } from 'react';
import { Upload, Camera, Sparkles, ChefHat, Clock, Users } from 'lucide-react';
import Navbar from './navbar';
import { useAuth } from '../AuthContext';
export default function DishRecipeGenerator() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [results, setResults] = useState(null);
  const {user}=useAuth();
  const fileInputRef = useRef(null);
  const [image,setImage]=useState()


  const handleImageUpload = (file) => {
     
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result);
      };
      reader.readAsDataURL(file);
      setImage(file);
      generateRecipe(file);
    }
  };

  const generateRecipe=async (image)=>{
    setIsLoading(true);
    try{
         const formData = new FormData();
         formData.append('image', image);
        const res=await fetch('http://localhost:3000/dish/generateRecipe',{
            method:'POST',
             
            body:formData
        })
        const data=await res.json();
        console.log(data.recipe);
        if (data) {
             setIsLoading(false);
        setResults(data.recipe);
        
      } else {
        console.error(data.error);
        alert('Failed to generate recipe');
      }
    }
    catch(Err){
        console.error(Err);
      alert('Something went wrong');
    }
  }

   
  
      

   const addToFav=async (strMeal,servings,ingredients,steps)=>{

      try{
           const formData = new FormData();
    formData.append('image', image);  
    formData.append('strMeal', strMeal);
    formData.append('servings', servings);
    formData.append('ingredients', JSON.stringify(ingredients)); 
    formData.append('steps', JSON.stringify(steps));  
   
          const res=await fetch(`http://localhost:3000/dish/save/${user._id}`,{
             method:'POST',
              
             body:formData

          })
          const data=await res.json();
          console.log(data);
          if(!res.ok){
              console.log("Cannot add this to fav",data.message);
          }
          else{
            alert("added to favourites")
          }
      }
      catch(err){
      console.log(err);
      }
   }

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };


  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    console.log("file:"+files[0]);
    if (files.length > 0) {
      handleImageUpload(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const resetUpload = () => {
    setUploadedImage(null);
    setResults(null);
    setIsLoading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
    
    <div className="min-h-screen bg-gradient-to-br from-pink-600 via-red-600 to-orange-600 flex">
      
      <div className="w-1/4 p-6 overflow-y-auto">
       
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-2 mb-4">
            <ChefHat className="w-8 h-8 text-white" />
            <h1 className="text-2xl font-bold text-white">DishCraft</h1>
            <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
          </div>
          <p className="text-sm text-white/90 leading-relaxed">
            Upload a dish photo to get AI-generated ingredients and recipe
          </p>
        </div>

       
        {!uploadedImage && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 mb-6 border border-white/20 shadow-xl">
            <div
              className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 relative overflow-hidden ${
                isDragOver
                  ? 'border-yellow-400 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 text-white'
                  : 'border-white/40 bg-gradient-to-br from-white/5 to-white/10 hover:from-white/10 hover:to-white/15'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="relative z-10">
                {isDragOver ? (
                  <Camera className="w-12 h-12 text-yellow-400 mx-auto mb-3 animate-pulse" />
                ) : (
                  <Upload className="w-12 h-12 text-white/70 mx-auto mb-3 hover:scale-110 transition-transform duration-300" />
                )}
                
                <h3 className="text-lg font-bold text-white mb-2">
                  {isDragOver ? 'Drop photo here!' : 'Upload Dish Photo'}
                </h3>
                <p className="text-white/80 mb-4 text-sm">
                  Drag & drop or click to browse
                </p>
                
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-semibold py-2 px-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg text-sm"
                >
                  <Upload className="w-4 h-4 inline mr-1" />
                  Choose Photo
                </button>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                
                <p className="text-white/60 text-xs mt-3">
                  JPG, PNG, WebP (Max 10MB)
                </p>
              </div>
            </div>
          </div>
        )}


        {uploadedImage && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 mb-6 border border-white/20 shadow-xl">
            <div className="text-center">
              <img
                src={uploadedImage}
                alt="Uploaded dish"
                className="w-full rounded-xl shadow-lg object-cover mb-4 max-h-40"
              />
              <h3 className="text-lg font-bold text-white mb-2">
                Analyzing dish...
              </h3>
              <p className="text-white/80 mb-4 text-sm">
                AI is preparing your recipe!
              </p>
              <button
                onClick={resetUpload}
                className="bg-white/20 hover:bg-white/30 cursor-pointer text-white font-semibold py-2 px-4 rounded-full transition-all duration-300 border border-white/30 text-sm"
              >
                Upload Different Photo
              </button>
               <button
                onClick={() => addToFav(results.name,results.servings,results.ingredients,results.steps)}
                className="bg-white hover:bg-white/70 text-orange-500 font-semibold py-2 px-4 rounded-full transition-all my-4 cursor-pointer duration-300 border border-white/30 text-sm"
              >
                Add to Favourites
              </button>
            </div>
          </div>
        )}


       
        {isLoading && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-center border border-white/20 shadow-xl">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
              <Sparkles className="w-4 h-4 text-yellow-300 absolute top-4 left-1/2 transform -translate-x-1/2 animate-pulse" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Processing...</h3>
            <p className="text-white/80 text-sm">Generating your recipe</p>
          </div>
        )}
      </div>

    
      <div className="w-3/4 bg-gray-50 p-8 overflow-y-auto">
        {results && !isLoading ? (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-3">
                <ChefHat className="w-10 h-10 text-orange-500" />
                {results.name}
              </h2>
              <div className="flex justify-center gap-8 text-gray-600">
                
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span>{results.servings} servings</span>
                </div>
              </div>
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
                  {results.ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-center gap-3 text-gray-700">
                      <span className="w-2 h-2 bg-orange-400 rounded-full flex-shrink-0"></span>
                      <span className="text-lg">{ingredient}</span>
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
                  {results.steps.map((step, index) => (
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
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <ChefHat className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-2xl font-bold mb-2">Ready to Cook!</h3>
              <p className="text-lg">Upload a dish photo to get started with AI-generated recipes</p>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
}