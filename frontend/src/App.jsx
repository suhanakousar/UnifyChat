import { GoogleOAuthProvider } from "@react-oauth/google";
import React, { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import { Routes } from "./routes/Routes";
import CustomCursor from "./components/common/CustomCursor";
import { useAuth } from "./context/authContext";

// Use environment variable or fallback to default
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID ||
                  import.meta.env.REACT_APP_GOOGLE_CLIENT_ID ||
                  "339367030371-gk3isctlpt7cb810qf51e1siugd3g7le.apps.googleusercontent.com";

const App = () => {
  const { login } = useAuth();

  useEffect(() => {
    // Check for token in URL query params (from OAuth redirect)
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
      console.log('Token found in URL, logging in:', token);
      login(token);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [login]);

  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <CustomCursor />
      <Routes />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        drggable
        pauseOnHover
        theme="colored"
      />
    </GoogleOAuthProvider>
  );
};

export default App;
