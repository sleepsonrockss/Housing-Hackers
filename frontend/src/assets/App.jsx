import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

// Pages
import LandingPage from "../pages/LandingPage";
import HowItWorks from "../pages/how-it-works";
import Chapters from "../pages/Chapters";
import About from "../pages/about";
import SignIn from "../pages/login";
import SignUp from "../pages/signup";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/chapters" element={<Chapters />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Router>
  );
}

export default App;