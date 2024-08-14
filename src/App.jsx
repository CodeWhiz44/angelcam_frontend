import "./App.css";
import Login from "./views/Login";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthProvider";
import ProtectedRoute from "./contexts/ProtectedRoute";
import SharedCameras from "./views/SharedCameras";
import SingleCamera from "./views/SingleCamera";

function Container() {
  return (
    <div className="max-w-[1280px] mx-auto p-2 text-center">
      <Outlet />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<Container />}>
            <Route path="/" index element={<Login />} />
            <Route
              path="/cameras"
              element={
                <ProtectedRoute>
                  <SharedCameras />
                </ProtectedRoute>
              }
            />
            <Route
              path="/camera/:id"
              element={
                <ProtectedRoute>
                  <SingleCamera />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
