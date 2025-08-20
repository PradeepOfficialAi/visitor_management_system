import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext.jsx";
import Notification from "../../components/notification";


import { Visibility, VisibilityOff } from "@mui/icons-material";
import Loading from "../../components/loading";
import userData from "../../utils/data/userData.js";

const Login = () => {
  let navigate = useNavigate();

  const { setUser } = useContext(UserContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    const user = userData.find((user) => user.user_name === username);

    if (user && user.password === password) {
      Notification.showSuccessMessage("Welcome", "Logged in Successfully");
      const token = "fake-token";
      localStorage.setItem("user_id", user.id);
      localStorage.setItem("user_name", user.user_name);
      localStorage.setItem("user_type", user.user_type);
      localStorage.setItem("image", user.image);
      localStorage.setItem("token", token);
      localStorage.setItem("refresh_token", "fake-refresh-token");
      localStorage.setItem("userInfo", JSON.stringify(user));

      setUser(user);
      setUsername("");
      setPassword("");
      navigate("/");
    } else {
      setIsLoading(false);
      Notification.showErrorMessage("Login Failed", "Invalid credentials");
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/");
    }
  });

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><Loading/></div>;
  }

  return (
    <div className="flex items-center justify-center h-screen bg-primary-dark w-full">
      <form className="p-8 min-w-[440px] rounded-lg shadow-lg bg-secondary-dark" onSubmit={handleSubmit} >
        
        <div className="flex justify-center mb-1 text-white text-lg md:text-xl">
          Visitor Management System
        </div>
        <div className="flex justify-center mb-4 text-white text-lg md:text-xl">
          
        </div>
        <div className="mb-4">
          <label htmlFor="username" className="sr-only">Username</label>
          <input
            type="text"
            id="username"
            className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-blue"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-6 relative">
          <label htmlFor="password" className="sr-only">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-blue pr-10"
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={handleTogglePasswordVisibility}
            className="absolute inset-y-0 right-0 pr-3 flex text-white items-center text-sm leading-5"
          >
            {showPassword ? <VisibilityOff /> : <Visibility />}
          </button>
        </div>

        <button type="submit" className="w-full bg-accent-blue hover:bg-blue-700 text-white p-3 rounded-lg font-semibold transition duration-300">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;



