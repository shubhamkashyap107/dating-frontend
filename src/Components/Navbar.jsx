import axios from "axios";
import React, { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png"

const Navbar = () => {
  const userData = useSelector((store) => store.user);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      let res = await axios.get("http://localhost:8080/auth/logout", {
        withCredentials: true,
      });
      toast.success("User Logged out")
      navigate("/auth");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-black text-white flex h-[70px] justify-between items-center px-10 shadow-md">
  {/* Logo */}
  <img src={logo} className="h-[60px]" alt="Logo" />

  <div className="flex items-center gap-6">
    {/* User Info */}
    <span className="flex items-center gap-3">
      <i className="fa-solid fa-user fa-xl text-white"></i>
      <p className="text-lg font-medium">Welcome, {userData.username}</p>
    </span>

    {/* Hamburger Icon & Dropdown */}
    <div className="relative" ref={dropdownRef}>
      <i
        className="fa-solid fa-bars text-white text-2xl cursor-pointer hover:text-gray-400 transition duration-200"
        onClick={() => setMenuOpen(!menuOpen)}
      ></i>

      {/* Dropdown Menu */}
      {menuOpen && (
        <div className="absolute right-0 mt-3 w-56 bg-gray-900 text-white rounded-lg shadow-xl z-50 backdrop-blur-lg bg-opacity-90 animate-fade-in">
          <ul className="flex flex-col">
            <Link to="/home" className="px-5 py-3 hover:bg-gray-700 font-medium transition">
              Home
            </Link>
            <Link to="/profile" className="px-5 py-3 hover:bg-gray-700 font-medium transition">
              Profile
            </Link>
            <Link to="/connections" className="px-5 py-3 hover:bg-gray-700 font-medium transition">
              Connections
            </Link>
            <button
              onClick={logoutHandler}
              className="px-5 py-3 text-left text-red-500 hover:bg-red-600 font-medium w-full transition"
            >
              Logout
            </button>
          </ul>
        </div>
      )}
    </div>
  </div>
</div>

  
  );
};

export default Navbar;
