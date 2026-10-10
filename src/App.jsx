import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

import Home from "./Home.jsx";
import Login from "./Login.jsx";
import Register from "./Register.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import Services from "./Services.jsx";
import NewRequest from "./NewRequest.jsx";
import MyRequests from "./MyRequests.jsx";
import ProviderRequests from "./ProviderRequests.jsx";
import Dashboard from "./Dashboard.jsx";
import AdminRequests from "./AdminRequests.jsx";
import Users from "./Users.jsx";
import Providers from "./Providers.jsx";
import Categories from "./Categories.jsx";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Landing & Auth */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* USER routes */}
        <Route element={<ProtectedRoute roles={["USER"]} />}>
          <Route path="/services" element={<Services />} />
          <Route path="/requests/new" element={<NewRequest />} />
          <Route path="/my-requests" element={<MyRequests />} />
        </Route>

        {/* PROVIDER routes */}
        <Route element={<ProtectedRoute roles={["PROVIDER"]} />}>
          <Route path="/provider/requests" element={<ProviderRequests />} />
        </Route>

        {/* ADMIN routes */}
        <Route element={<ProtectedRoute roles={["ADMIN"]} />}>
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/requests" element={<AdminRequests />} />
          <Route path="/admin/users" element={<Users />} />
          <Route path="/admin/providers" element={<Providers />} />
          <Route path="/admin/categories" element={<Categories />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
