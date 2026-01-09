import SignupPage from "./pages/Signup-page";
import Landingpage from "./pages/Landingpage";
import Layout from "./components/Layout";
import SigninPage from "./pages/Signin-page";
import Dashboard from "./pages/Dashboard";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Landingpage />}></Route>
            <Route path="/signup" element={<SignupPage />}></Route>
            <Route path="/signin" element={<SigninPage />}></Route>
            <Route path="/dashboard" element={<Dashboard />}></Route>
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
