import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const MyProfile = () => {

    const navigate = useNavigate()

    const userSliceData = useSelector((store) => {
        return store.user
    })

    function calculateAge(dateString) {
        const birthDate = new Date(dateString);
        const today = new Date();
    
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        const dayDiff = today.getDate() - birthDate.getDate();
    
        // Adjust age if the birthday hasn't occurred yet this year
        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
            age--;
        }
    
        return age;
    }
    

  return (
    <div className="flex items-center justify-center h-screen bg-gray-200">
      {/* iPhone Frame */}
      <div className="w-[320px] h-[600px] bg-white rounded-[40px] shadow-2xl border border-gray-300 overflow-hidden">
        {/* Notch */}
        <div className="h-6 bg-black w-32 rounded-b-xl mx-auto mt-2"></div>

        {/* Profile Section */}
        <div className="flex flex-col items-center p-6">
          <img
            src={userSliceData.image}
            alt="Profile"
            className="w-40 h-40 mt-10 rounded-full border-4 border-gray-300 object-cover"
          />
          <h2 className="text-xl font-semibold mt-10">{userSliceData.firstName + " " + userSliceData.lastName + ", " + calculateAge(userSliceData.DOB)}</h2>
          <p className="text-gray-500 text-sm text-center mt-1">
            {userSliceData.bio}
          </p>
        </div>

        {/* Buttons */}
        <div className=" w-full flex justify-center gap-4 mt-5">
          <button onClick={() => {
            navigate("/profile/edit")
          }} className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-400 transition">
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
