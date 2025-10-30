import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

import Login from "./comps/Login.jsx";
import Nav from "./comps/Nav.jsx";
import Content from "./comps/Content.jsx";

function App() {
  const [cuser, setCuser] = useState("");
  const [login, isLogin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      localStorage.removeItem("token");
      isLogin(false);
      setLoading(false);
      return;
    }
    const user = async () => {
      try {
        const res = await axios.get("http://localhost:8080/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) {
          setCuser(res.data.user);
          isLogin(true);
        }
      } catch (error) {
        localStorage.removeItem("token");
        console.log(error);
        isLogin(false);
      }finally {
        setLoading(false);
      }
    };
    user();
  }, []);


  if (loading) {
    return <div>Loading...</div>;
  }
  if (!login) {
    return <Login />;
  }
  return (
    <>
      <Nav />
      <Content />
    </>
  );
}

export default App;
