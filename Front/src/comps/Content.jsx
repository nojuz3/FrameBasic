import { useEffect, useState } from "react";
import axios from "axios";
import Create from "./Create";
import Confirm from "./Confirm";
import Main from "./Main";
export default function Content() {
  const [user, setUser] = useState(null);
  const [data, setData] = useState([]);
  const [view, setView] = useState(2); // 0: Default, 1: Create
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:8080/me", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setUser(res.data.user);
      } catch (error) {
        console.log(error);
      }
    };
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:8080/data", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (res.data.success) {
          setData(res.data.festivals);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
    fetchUser();
  }, []);
  return (
    <div class="content">
      <div class="sticky">
        <button onClick={() => setView(1)}>Create</button>
        <button onClick={() => setView(2)}>Main</button>
        {user && user.role === "admin" && (
          <button onClick={() => setView("4569")}>Admin</button>
        )}
      </div>
      <div>
        {view === 1 && <Create />}
        {view === 2 && <Main />}
        {view === "4569" && <Confirm />}
      </div>
    </div>
  );
}
