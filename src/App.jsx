import React, { useState, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AppRoutes from "./routes/AppRoutes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CookieConsent from "./components/common/CookieConcent";

function App() {
  const [showPopup, setShowPopup] = useState(false);
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) {
      setTimeout(() => setShowConsent(true), 10000);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie_consent", "true");
    setShowConsent(false);
  };
  return (
    <>
      {showPopup && <Popup onClose={() => setShowPopup(false)} />}
      {showConsent && <CookieConsent onAccept={handleAccept} />}
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
          <ToastContainer />
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
