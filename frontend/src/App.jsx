import { GoogleOAuthProvider } from "@react-oauth/google";
import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import { Routes } from "./routes/Routes";
import CustomCursor from "./components/common/CustomCursor";

// Use environment variable or fallback to default
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 
                  import.meta.env.REACT_APP_GOOGLE_CLIENT_ID || 
                  "339367030371-gk3isctlpt7cb810qf51e1siugd3g7le.apps.googleusercontent.com";

const App = () => {
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
