import "./App.css";
import Home from "./views/Home";
import { PlantsContextProvider } from "./store/PlantsContext";
import { AuthContextProvider } from "./store/AuthContext";
import NavigationBar from "./components/NavigationBar";
import { Route, Routes } from "react-router-dom";
import Pdp from "./views/Pdp";
import SignUp from "./views/SignUp.js";
import Login from "./views/Login";
import MyProfile from "./views/MyProfile";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <div>
      <AuthContextProvider>
        <NavigationBar />
        <PlantsContextProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/plants/:_id" element={<Pdp />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/myprofile"
              element={
                <ProtectedRoute>
                  <MyProfile />
                </ProtectedRoute>
              }
            />
          </Routes>
        </PlantsContextProvider>
      </AuthContextProvider>
    </div>
  );
}

export default App;
