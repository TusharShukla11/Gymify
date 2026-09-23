import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

import Home from "./pages/Home";
import Login from "./pages/Login";

import AdminLayout from "./layouts/AdminLayout";

import Members from "./pages/Members";
import AddMember from "./pages/AddMember";
import MemberDetails from "./pages/MemberDetails";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>

        <Routes>

          {/* PUBLIC HOME PAGE */}
          <Route
            path="/"
            element={<Home />}
          />

          {/* LOGIN PAGE */}
          <Route
            path="/login"
            element={<Login />}
          />

          {/* PROTECTED / MANAGEMENT AREA */}
          <Route element={<AdminLayout />}>

            <Route
              path="/members"
              element={<Members />}
            />

            <Route
              path="/members/add"
              element={<AddMember />}
            />

            <Route
              path="/members/:id"
              element={<MemberDetails />}
            />

          </Route>

          {/* FALLBACK */}
          <Route
            path="*"
            element={
              <Navigate
                to="/"
                replace
              />
            }
          />

        </Routes>

      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;