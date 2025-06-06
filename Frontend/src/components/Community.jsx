import React, { useState, useEffect } from 'react';
import { Upload, Heart, User, Clock, ChefHat } from 'lucide-react';
import { useAuth } from '../AuthContext';
const RecipeSharingApp = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    recipe: '',
    image: null,
    userId: ''
  });
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    if (user && user._id) {
      setFormData(prev => ({
        ...prev,
        userId: user._id
      }));
    }
  }, [user]);


  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {

      const response = await fetch('http://localhost:3000/community/getpost');
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));

      const reader = new FileReader();
      reader.onload = (e) => setPreviewImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.recipe || !formData.image) {
      alert('Please fill in all fields and select an image');
      return;
    }

    setUploading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('recipe', formData.recipe);
      formDataToSend.append('image', formData.image);

      const response = await fetch(`http://localhost:3000/community/addpost/${formData.userId}`, {
        method: 'POST',
        body: formDataToSend
      });

      if (response.ok) {
        const newPost = await response.json();
        setPosts(prev => [newPost.data, ...prev]);

        setFormData({
          title: '',
          recipe: '',
          image: null,
          userId: formData.userId
        });
        setPreviewImage(null);

        alert('Recipe posted successfully!');
      } else {
        throw new Error('Failed to post recipe');
      }
    } catch (error) {
      console.error('Error posting recipe:', error);
      alert('Failed to post recipe. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      const response = await fetch(`http://localhost:3000/community/${postId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: formData.userId })
      });

      if (response.ok) {
        const data = await response.json();
        setPosts(prev => prev.map(post =>
          post._id === postId
            ? { ...post, likes: data.likes }
            : post
        ));
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-500 via-orange-500 to-amber-600">
      <div className="container mx-auto px-4 py-8">


        <div className="bg-white rounded-2xl shadow-2xl p-4 mb-12 transform transition-all duration-300">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Share Your Recipe</h2>

          <div className="space-y-6">

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Dish Name
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter your dish name..."
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-300"
              />
            </div>


            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Recipe Instructions
              </label>
              <textarea
                name="recipe"
                value={formData.recipe}
                onChange={handleInputChange}
                placeholder="Share your recipe steps, ingredients, and cooking tips..."
                rows="6"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-300 resize-vertical"
              />
            </div>


            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Dish Photo
              </label>
              <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-orange-400 transition-colors duration-300">
                {previewImage ? (
                  <div className="space-y-4">
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="mx-auto max-h-48 rounded-lg shadow-md"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewImage(null);
                        setFormData(prev => ({ ...prev, image: null }));
                      }}
                      className="text-red-500 hover:text-red-700 font-medium"
                    >
                      Remove Image
                    </button>
                  </div>
                ) : (
                  <div>
                    <Upload className="mx-auto w-12 h-12 text-gray-400 mb-4" />
                    <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
                    <p className="text-sm text-gray-400">PNG, JPG up to 10MB</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={uploading || !formData.title || !formData.recipe || !formData.image}
              className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-red-600 hover:to-orange-600 transform transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {uploading ? 'Sharing Recipe...' : 'Share Recipe'}
            </button>
          </div>
        </div>


        <div>
          <h2 className="text-4xl font-bold text-white text-center mb-8">
            Community Recipes
          </h2>

          {loading ? (
            <div className="text-center text-white text-xl">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              Loading recipes...
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center text-white text-xl bg-white/10 rounded-2xl p-12 backdrop-blur-sm">
              <ChefHat className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>No recipes shared yet. Be the first to share your creation!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1  gap-8">
              {posts.map((post, index) => (
                <div
                  key={post._id || index}
                  className="bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300"
                >

                  <div className="relative overflow-hidden">
                    <img
                      src={post.photo}
                      alt={post.title}
                      className="w-full h-64 object-contain transition-transform duration-300 hover:scale-105 bg-gray-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>


                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">
                      {post.title}
                    </h3>

                    <div className="flex items-center text-gray-600 mb-4">
                      <User className="w-4 h-4 mr-2" />
                      <span className="text-sm">By {post.username.name}</span>
                      <Clock className="w-4 h-4 ml-4 mr-2" />
                      <span className="text-sm">
                        {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Recently'}
                      </span>
                    </div>

                    <p className="text-gray-700 mb-4 overflow-hidden" style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical'
                    }}>
                      {post.recipe}
                    </p>

                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => handleLike(post._id)}
                        className="flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors duration-300"
                      >
                        <Heart className="w-5 h-5" />
                        <span>{post.likes?.length || 0} likes</span>
                      </button>
 
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeSharingApp;