import { useEffect, useState } from "react";
import axios from "axios";
import Create from "./Create";
export default function Content() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState(0); // 0: Default, 1: Create
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
    fetchUser();
  }, []);
  return (
    <div class="content">
      <button onClick={() => setView(1)}>Create</button>
      <button onClick={() => setView(0)}>Main</button>
      {user && user.role === "admin" && (
        <button onClick={() => setView("4569")}>Admin</button>
      )}
      <div>
        {view === 1 && <Create />}
        {view === "4569" && <div>Admin Panel</div>}
      </div>
    </div>
  );
}
