import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { base_url } from '../Utils/Constants';
import Loader from './Loader';
import { motion, AnimatePresence } from "framer-motion";

const Home = () => {
  const [users, setUsers] = useState([]);
  const [isDbEmpty, setIsDbEmpty] = useState(false);

  useEffect(() => {
    if (users.length === 0 && !isDbEmpty) {
      const getData = async () => {
        try {
          const res = await axios.get(`${base_url}/user/feed?limit=5`, { withCredentials: true });

          if (res.data.length > 0) {
            setUsers(res.data);
          } else {
            setIsDbEmpty(true);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
          setIsDbEmpty(true);
        }
      };

      getData();
    }
  }, [users.length, isDbEmpty]);

  function calculateAge(dateString) {
    const birthDate = new Date(dateString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();

    if (today.getMonth() < birthDate.getMonth() ||
        (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  }

  async function btnClickHandler(status, id, direction) {
    setUsers((prev) => {
      if (prev.length === 0) return prev;
      
      let updatedUsers = [...prev];
      updatedUsers[0] = { ...updatedUsers[0], exitDirection: direction };

      setTimeout(async () => {
        await axios.post(`${base_url}/connection/send/${status}/${id}`, {}, { withCredentials: true });
        setUsers(updatedUsers.slice(1));
      }, 400);

      return updatedUsers;
    });
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-200">
      {/* iPhone Frame */}
      <div className="w-[390px] h-[750px] bg-white rounded-[50px] shadow-2xl border border-gray-300 overflow-hidden relative">
        
        {/* Notch */}
        <div className="h-6 bg-black w-36 rounded-b-xl mx-auto mt-2"></div>

        {/* Content */}
        <div className="flex flex-col items-center p-6">
          {isDbEmpty ? (
            <div className="flex justify-center h-[70vh] items-center">
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }} 
                animate={{ opacity: 1, scale: 1 }} 
                transition={{ duration: 0.6, ease: "easeOut" }} 
                className="bg-gray-100 px-6 py-8 rounded-xl shadow-lg text-center"
              >
                <motion.div 
                  initial={{ y: -10 }} 
                  animate={{ y: 10 }} 
                  transition={{ repeat: Infinity, duration: 1.5, repeatType: "reverse" }}
                >
                  <i className="fa-solid fa-face-sad-tear text-gray-400 text-6xl"></i>
                </motion.div>
                <h1 className="text-3xl font-bold text-gray-800 mt-4">No Users Found</h1>
                <p className="text-gray-500 mt-2">Try again later!</p>
              </motion.div>
            </div>
          ) : users.length > 0 ? (
            <AnimatePresence mode="popLayout">
              <motion.div
                key={users[0]._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, x: users[0].exitDirection === "left" ? -200 : 200, scale: 0.8 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="bg-white shadow-lg rounded-2xl p-6 w-80 mx-auto text-center border border-gray-200 mt-20"
              >
                <img
                  onError={(e) => {
                    e.target.src = "https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-image-182145777.jpg";
                  }}
                  src={users[0].image}
                  className="h-48 w-48 rounded-full mx-auto border-4 border-pink-500 object-cover"
                  alt={`${users[0].firstName}'s profile`}
                />
                <h2 className="text-xl font-semibold mt-4">
                  {users[0].firstName + " " + users[0].lastName},{" "}
                  {calculateAge(users[0].DOB)}
                </h2>
                <p className="text-gray-600 mt-2 px-4">{users[0].bio}</p>

                <div className="flex justify-between mt-6">
                  <button
                    onClick={() => btnClickHandler("ignore", users[0]._id, "left")}
                    className="bg-gray-300 cursor-pointer text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition transform hover:scale-105"
                  >
                    Ignore
                  </button>
                  <button
                    onClick={() => btnClickHandler("interested", users[0]._id, "right")}
                    className="bg-pink-500 cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition transform hover:scale-105"
                  >
                    Interested
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          ) : (
            <Loader />
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
