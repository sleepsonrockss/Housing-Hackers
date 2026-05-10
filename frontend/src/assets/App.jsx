import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

// Pages
import LandingPage from "../pages/LandingPage";
import HowItWorks from "../pages/how-it-works";
import Chapters from "../pages/Chapters";
import About from "../pages/about";
import SignIn from "../pages/login";
import SignUp from "../pages/signup";
import GameScenario from "../pages/GameScenario_VideoIntegrated";
import RunChoicesLog from "../pages/RunChoicesLog";
import DayChapterReview from "../pages/DayChapterReview";
import StressCalibration from "../pages/StressCalibration";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/calibrate-stress" element={<StressCalibration />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/chapters" element={<Chapters />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/game/run-log" element={<RunChoicesLog />} />
        <Route path="/game/day/:day" element={<DayChapterReview />} />
        <Route path="/game" element={<GameScenario />} />
      </Routes>
    </Router>
  );
}

export default App;