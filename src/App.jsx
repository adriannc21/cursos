import { Routes, Route, Navigate } from "react-router-dom";
import Perfil from "./pages/Perfil/Perfil";  
import Home from "./pages/Home/Home";  
import Layout from "./components/Layout"; 

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Route>
    </Routes>
  );
}

export default App;
