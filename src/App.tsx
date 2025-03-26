import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import LoginScreen from "./screens/LoginScreen";
import HomeScreen from "./screens/HomeScreen";
import AddEntryScreen from "./screens/AddEntryScreen";
import ViewEntryScreen from "./screens/ViewEntryScreen";
import { kdbxService } from "./services/kdbxService";
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useTheme } from './theme/theme';
import './styles/global.css';

const App: React.FC = () => {
  const { masterPassword } = useAuth();
  const theme = useTheme();

  useEffect(() => {
    const handleBeforeUnload = async () => {
      if (masterPassword) {
        try {
          const dbData = await kdbxService.saveDatabase();
          localStorage.setItem("passwordDatabase", JSON.stringify(Array.from(new Uint8Array(dbData))));
        } catch (error) {
          console.error("Error saving database:", error);
        }
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [masterPassword]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              masterPassword ? <Navigate to="/home" replace /> : <LoginScreen />
            }
          />
          <Route
            path="/home"
            element={
              masterPassword ? <HomeScreen /> : <Navigate to="/" replace />
            }
          />
          <Route
            path="/add-entry"
            element={
              masterPassword ? <AddEntryScreen /> : <Navigate to="/" replace />
            }
          />
          <Route
            path="/view-entry/:id"
            element={
              masterPassword ? <ViewEntryScreen /> : <Navigate to="/" replace />
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App; 