import { useState, useEffect } from "react";
import axios from "axios";

export default function Login() {
  const [type, setType] = useState(1); // 1 for login, 2 for register
  const [username,setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const handleLogin = async(e) =>{
    e.preventDefault();
    try {
        const res = await axios.post("http://localhost:8080/login",{
          username,
          password
        });
        if(res.data.success){
            alert("Login Successful");
            localStorage.setItem("token", res.data.token);
            setEmail("");
            setPassword("");
            setUsername("");
            window.location.reload();
        }
    } catch (error) {
        console.log(error)
    }
  }
  const handleRegister = async (e) =>{
    e.preventDefault();
    try {
        const res = await axios.post("http://localhost:8080/register",{
          username,
          email,
          password
        });
        if(res.data.success){
            alert("Registered Successfully");
            setType(1);
            setEmail("");
            setPassword("");
            setUsername("");
        }
    } catch (error) {
        console.log(error)
    }
  }
  return (
    <div>
      <div>
        {type === 1 ? <h2>Login</h2> : <h2>Register</h2>}
        {type === 1 && (
          <form onSubmit={(e) => handleLogin(e)}>
            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="submit">Login</button>
          </form>
        )}
        {type === 2 && (
          <form onSubmit={(e) => handleRegister(e)}>
            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="submit">Register</button>
          </form>
        )}
      </div>
      <button onClick={() => setType(type === 1 ? 2 : 1)}>
        {type === 1 ? "Go to Register" : "Go to Login"}
      </button>
    </div>
  );
}
