import { useState, useEffect } from "react";
import axios from "axios";

export default function Confirm() {
  const [user, setUser] = useState(null);
  const [data, setData] = useState([]);
  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:8080/placeholder/all", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setData(res.data.placeholders);
    } catch (error) {
      console.log(error);
    }
  };
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

    fetchData();
    fetchUser();
  }, []);
  const handleConfirm = async (item) => {
    console.log(item.id);
    try {
      const res = await axios.post(
        "http://localhost:8080/placeholder/confirm",
        { id: item.id, ...item },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      if (res.data.success) {
        fetchData();
        alert("confirmed successfully!");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleDelete = async (item) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this placeholder"
    );
    if (!confirmed) return;
    try {
      const res = await axios.post(
        "http://localhost:8080/placeholder/delete",
        { id: item.id },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      if (res.data.success) {
        fetchData();
        alert("deleted successfully!");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <div>
        {data.map((item) => (
          <div key={item.id || index}>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <p>{item.date}</p>
            <p>{item.location}</p>
            <p>{item.ticketPrice}</p>
            <p>{item.capacity}</p>
            <p>{item.category}</p>
            <p>{item.image}</p>
            <button onClick={() => handleConfirm(item)}>Confirm</button>
            <button onClick={() => handleDelete(item)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
