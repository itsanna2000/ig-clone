import './App.css';
import React, {useState} from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/navbar";
import {Timeline} from "./pages/home";
import { Create } from "./pages/create";
import { User } from "./pages/user";
import {AuthContext} from "./context/AuthContext";
import Cookies from "universal-cookie";
import { ThemeContext } from "./context/ThemeContext";

function App() {

  const cookies = new Cookies();

  const [isAuth, setIsAuth] = useState(cookies.get("auth-token"));

  const [theme, setTheme] = useState("light");

  return (
    <ThemeContext.Provider value={{theme, setTheme}}>
    <div className="App" id={theme} >
      <AuthContext.Provider value={{isAuth, setIsAuth}}>
        <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Timeline />} />
          <Route path="/create" element={<Create />} />
          <Route path="/user" element={<User />} />
        </Routes>
        </Router>
      </AuthContext.Provider>
    </div>
    </ThemeContext.Provider>
  );
}

export default App;
