import LandingPage from './pages/LandingPage'
import { Routes, Route } from 'react-router-dom';
import UploadPage from './pages/UploadPage'; 
import QuizPage from './pages/QuizPage';
import ProfilePage from './pages/ProfilePage'; 
import AboutPage from './pages/AboutPage';




function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/quiz/:id" element={<QuizPage />} />
        <Route path="/profile" element={<ProfilePage />} /> 
        <Route path="/about" element={<AboutPage />} />
        
      </Routes>
    </div>
  )
}

export default App