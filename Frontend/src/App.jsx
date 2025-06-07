import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './components/Login';
import Signup from './components/Signup';
import Home from './components/Home';
import About from './components/About';
import Recipe from './components/Recipe';
import SavedDish from './components/SavedDish';
import ImageToRec from './components/ImageToRec';
import Favrec from './components/favRecip';
import Community from './components/Community';
import ProtectedRoute from './Protectedroute';

function App() {
  return (
    <Router>
      <Routes>
      
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/saved/:id" element={<SavedDish />} />
          <Route path="/recipe/:userId/:dishId"  element={
              <ProtectedRoute>
                <Favrec />
              </ProtectedRoute>
            } />
          <Route
            path="/generateRecipe"
            element={
              <ProtectedRoute>
                <ImageToRec />
              </ProtectedRoute>
            }
          />
          <Route path="/:id" element={<Recipe />} />
          <Route path="/community" element={<Community />} />
          
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
