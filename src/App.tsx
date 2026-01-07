import { BrowserRouter, Route, Routes } from "react-router-dom";
import { RouterKey } from "./const/router-key";
import { Dashboard } from "./pages/dashboard/Dashboard";
import { Login } from "./pages/login/Login";
import { Signup } from "./pages/signup/Signup";
import { Toaster } from "./components/ui/Toaster";

function App() {
  return (
    <>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path={RouterKey.DASHBOARD} element={<Dashboard />} />
          <Route path={RouterKey.LOGIN} element={<Login />} />
          <Route path={RouterKey.SIGNUP} element={<Signup />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
