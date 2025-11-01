import { useState } from "react";
import axios from "axios";
export default function Create() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    ticketPrice: "",
    capacity: "",
    category: "music",
    image: "",
  });

  const date = new Date();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  console.log(formData);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8080/placeholder",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.success) {
        alert("created successfully!");
        setFormData({
          title: "",
          description: "",
          date: "",
          location: "",
          ticketPrice: "",
          capacity: "",
          category: "music",
          image: "",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div class="create-festival">
      <h2>Create New Festival</h2>
      <form onSubmit={handleSubmit}>
        <div class="form-group">
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Festival Name"
            required
          />
        </div>

        <div class="form-group">
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Festival Description"
            required
          />
        </div>

        <div class="form-group">
          <input
            type="datetime-local"
            name="date"
            value={formData.date}
            onChange={handleChange}
            min={date.toISOString().slice(0,16)}
            required
          />
        </div>

        <div class="form-group">
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Location"
            required
          />
        </div>

        <div class="form-group">
          <input
            type="number"
            name="ticketPrice"
            value={formData.ticketPrice}
            onChange={handleChange}
            placeholder="Ticket Price"
            min="0"
            required
          />
        </div>

        <div class="form-group">
          <input
            type="number"
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
            placeholder="Maximum Capacity"
            min="1"
            required
          />
        </div>

        <div class="form-group">
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="music">Music</option>
            <option value="food">Food</option>
            <option value="cultural">Cultural</option>
            <option value="art">Art</option>
            <option value="sport">Sport</option>
          </select>
        </div>

        <div class="form-group">
          <input
            type="url"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="Image URL"
          />
        </div>

        <button type="submit">Create Festival</button>
      </form>
    </div>
  );
}
