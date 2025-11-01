import { useState, useEffect } from "react";
import axios from "axios";

export default function Main() {
  const [data, setData] = useState([]);
  useEffect(() => {
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
  }, []);
  return (
    <div class="main">
        {data.map((item) => (
          <div class="box" key={item.id || index}>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <p>{new Date(item.date).toLocaleString()}</p>
            <p>Location: {item.location}</p>
            <p>Ticket Price: ${item.ticketPrice}</p>
            <p>Capacity: {item.capacity}</p>
            <p>Category: {item.category}</p>
            <p>Image URL: {item.image}</p>
          </div>
        ))}
      </div>
  )
}
