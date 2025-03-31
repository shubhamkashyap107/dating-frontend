import axios from 'axios';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { addUser } from '../Utils/userSlice';

const Profile = () => {
  const userSliceData = useSelector(store => store.user);
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [tempUrl, setTempUrl] = useState("");

  const [profileData, setProfileData] = useState({
    firstName: userSliceData.firstName || "",
    lastName: userSliceData.lastName || "",
    username: userSliceData.username || "",
    DOB: userSliceData.DOB || "",
    bio: userSliceData.bio || "",
    image: userSliceData.image || ""
  });

  return (
    <div className="flex items-center justify-center h-screen bg-gray-200">
      {/* iPhone Frame */}
      <div className="w-[390px] h-[750px] bg-white rounded-[50px] shadow-2xl border border-gray-300 overflow-hidden relative">
        
        {/* Notch */}
        <div className="h-6 bg-black w-36 rounded-b-xl mx-auto mt-2"></div>

        {/* Content */}
        <div className="flex flex-col items-center p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">Edit Profile</h2>

          {/* Profile Image */}
          <label className="cursor-pointer relative">
            <img 
              className="w-40 h-40 rounded-full border-4 border-gray-300 object-cover"
              src={tempUrl || profileData.image || "https://www.shutterstock.com/image-vector/user-profile-icon-vector-avatar-600nw-2247726673.jpg"} 
              alt="Profile"
            />
            <input 
              type="file" 
              className="hidden" 
              onChange={async (e) => {
                const file = e.target.files[0];
                const url = URL.createObjectURL(file);
                setTempUrl(url);
                const fileData = new FormData();
                fileData.append("file", file);
                fileData.append("upload_preset", "myProjects");
                fileData.append("cloud_name", "ddx0hz1ku");

                const res = await axios.post("https://api.cloudinary.com/v1_1/ddx0hz1ku/image/upload", fileData);
                setProfileData({ ...profileData, image: res.data.secure_url });

              }}
            />
          </label>

          {/* Form Fields */}
          <div className="w-full mt-6 space-y-4">
            <input 
              value={profileData.firstName} 
              onChange={(e) => setProfileData({...profileData, firstName: e.target.value})} 
              type="text" 
              placeholder="First name" 
              className="w-full px-4 py-2 text-lg text-center bg-gray-100 focus:ring-0 outline-none"
            />
            <input 
              value={profileData.lastName} 
              onChange={(e) => setProfileData({...profileData, lastName: e.target.value})} 
              type="text" 
              placeholder="Last name" 
              className="w-full px-4 py-2 text-lg text-center bg-gray-100 focus:ring-0 outline-none"
            />
            <input 
              value={profileData.username} 
              onChange={(e) => setProfileData({...profileData, username: e.target.value})} 
              type="text" 
              placeholder="Username" 
              className="w-full px-4 py-2 text-lg text-center bg-gray-100 focus:ring-0 outline-none"
            />
            <input 
              value={profileData.DOB} 
              onChange={(e) => setProfileData({...profileData, DOB: e.target.value})} 
              type="date" 
              className="w-full px-4 py-2 text-lg text-center bg-gray-100 focus:ring-0 outline-none"
            />
            <textarea 
              value={profileData.bio} 
              onChange={(e) => setProfileData({...profileData, bio: e.target.value})} 
              placeholder="Bio" 
              className="w-full px-4 py-2 text-lg text-center bg-gray-100 focus:ring-0 outline-none resize-none h-24"
            ></textarea>
          </div>

          {/* Save Button */}
          <button 
            onClick={async () => {
              if(!profileData.firstName || !profileData.lastName || !profileData.username || !profileData.bio || !profileData.DOB || !profileData.image)
              {
                toast.error("Please enter all the details")
                return
              }


              const res = await axios.patch("http://localhost:8080/profile/edit", profileData, {withCredentials: true})

              if(res.status == 201)
                {
                  toast.success("User updated successfully!")
                  console.log(res.data)
                  dispatch(addUser(res.data.data))
                  navigate("/profile")
                }
            }} 
            className="w-full mt-5 bg-black text-white py-3 text-lg rounded-full hover:bg-gray-800 transition"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
