import React, { useState, useEffect } from 'react';
import { ChefHat, Camera, Upload, Users, Shield, Zap, ArrowRight, CheckCircle, Target, Award } from 'lucide-react';
import Footer from './footer';
const About = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: <Camera className="w-6 h-6" />,
      title: "Smart Recipe Detection",
      description: "Advanced AI analyzes your dish photos to provide accurate recipe recommendations and cooking instructions."
    },
    {
      icon: <Upload className="w-6 h-6" />,
      title: "Community Showcase",
      description: "Share your culinary creations with fellow cooking enthusiasts and build your culinary portfolio."
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Expert Network",
      description: "Connect with experienced chefs and home cooks to learn new techniques and get personalized advice."
    }
  ];

  const values = [
    {
      icon: <Target className="w-8 h-8" />,
      title: "Innovation",
      description: "Leveraging cutting-edge AI technology to revolutionize how people discover and share recipes."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Quality",
      description: "Ensuring every recipe recommendation meets our high standards for accuracy and reliability."
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Community",
      description: "Building a supportive environment where culinary passion and expertise can flourish."
    }
  ];

  const benefits = [
    "Instant recipe identification from any dish photo",
    "Access to a curated community of cooking enthusiasts",
    "Personalized recommendations based on your preferences",
    "Professional-grade recipe database with detailed instructions",
    "Secure platform with privacy-focused design",
    "Regular updates with new features and improvements"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-100">
     
      <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-orange-200/30">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ChefHat className="w-8 h-8 text-orange-600" />
              <span className="text-2xl font-bold text-gray-900">Cookverse</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#about" className="text-gray-700 hover:text-orange-600 font-medium">About</a>
              <a href="#features" className="text-gray-700 hover:text-orange-600 font-medium">Features</a>
              <a href="#values" className="text-gray-700 hover:text-orange-600 font-medium">Values</a>
              <a href="#contact" className="text-gray-700 hover:text-orange-600 font-medium">Contact</a>
            </div>
          </div>
        </div>
      </nav>

      
      <section className="bg-white/70 backdrop-blur-md py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Transforming Culinary Discovery Through 
              <span className="bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent"> AI Technology</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Cookverse is a professional platform that combines artificial intelligence with community-driven 
              content to help users identify recipes from dish photos and share their culinary creations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-orange-500 to-pink-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300">
                Get Started
              </button>
              <button className="border border-orange-300 text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors duration-200">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      
      <section id="about" className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">About Cookverse</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Founded with the vision of democratizing culinary knowledge, Cookverse serves as a bridge 
                between technology and traditional cooking wisdom. Our platform enables users to discover 
                recipes through image recognition while fostering a community of passionate food enthusiasts.
              </p>
              <p className="text-gray-600 mb-8 leading-relaxed">
                We believe that cooking is both an art and a science, and our mission is to make culinary 
                exploration accessible, educational, and enjoyable for everyone, regardless of their skill level.
              </p>
              <div className="space-y-3">
                {benefits.slice(0, 3).map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-orange-500 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
           
          </div>
        </div>
      </section>

     
      <section id="features" className="py-20 bg-white/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Platform Features</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover how Cookverse combines advanced technology with user-centric design 
              to deliver a seamless culinary experience.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-md rounded-xl p-8 hover:shadow-xl hover:scale-105 transition-all duration-300 border border-orange-200/30">
                <div className="bg-gradient-to-r from-orange-100 to-pink-100 w-12 h-12 rounded-lg flex items-center justify-center mb-6 text-orange-600">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

     
      <section id="values" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide our development and shape our commitment to the culinary community.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg text-orange-600">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

     

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Choose Cookverse?</h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Our platform is designed for both culinary enthusiasts and professionals who value 
                accuracy, community, and innovation in their cooking journey.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-white-500 to-indigo-100 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Ready to Get Started?</h3>
              <p className="text-gray-600 mb-6">
                Join thousands of cooking enthusiasts who trust Cookverse for recipe discovery and community engagement.
              </p>
              <button className="bg-gradient-to-r from-orange-500 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2">
                <span>Start Your Journey</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

   <Footer/>
  
    </div>
  );
};

export default About;