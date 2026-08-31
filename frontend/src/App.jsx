import { Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Navigation from "./components/navigation";
import Home from "./home";
import About from "./about";
import Services from "./services";
import Article from "./article";
import ContactUs from "./contactus";
import Appointment from "./appointment";
import Admin from "./admin";

function App() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [isLoggedin, setIsLoggedin] = useState(false);
  const location = useLocation();

  async function checkSession() {
    const response = await fetch(`${API_URL}/check_session`, {
      method: "GET",
      credentials: "include",
    });

    const data = await response.json();
    if (data.logged_in) {
      setIsLoggedin(true);
    } else {
      setIsLoggedin(false);
    }
  }

  useEffect(() => {
    checkSession();
  }, []);

  return (
    <>
      {location.pathname != "/admin" && (
        <Navigation isLoggedin={isLoggedin} setIsLoggedin={setIsLoggedin} />
      )}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/article" element={<Article />} />
        <Route path="/contactus" element={<ContactUs />} />
        <Route path="/appointment" element={<Appointment />} />
        <Route
          path="/admin"
          element={<Admin setIsLoggedin={setIsLoggedin} />}
        />
      </Routes>
    </>
  );
}

export default App;
