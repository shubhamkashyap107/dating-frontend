import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { base_url } from '../Utils/Constants';
import { motion, AnimatePresence } from "framer-motion";

const Connections = () => {
    
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        async function getData() {
            try {
                const res = await axios.get(`${base_url}/user/requests/received`, { withCredentials: true });
                const allReqs = res.data.map((item) => item.fromUserId);
                setRequests(allReqs);
                console.log(allReqs)
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
        getData();
    }, []);

    function calculateAge(dateString) {
        const birthDate = new Date(dateString);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();

        if (
            today.getMonth() < birthDate.getMonth() ||
            (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())
        ) {
            age--;
        }
        return age;
    }

    async function handleAction(id, action) {
        try {
            await axios.post(`${base_url}/connection/${action}/${id}`, {}, { withCredentials: true });

            // Animate the card removal
            setRequests((prev) => prev.filter((item) => item._id !== id));
        } catch (error) {
            console.error(`Error while ${action}:`, error);
        }
    }

    return (
        <div className="p-6 bg-gray-100 min-h-screen flex items-center justify-center">
            {requests.length > 0 ? (
                <div className="flex overflow-x-auto space-x-6 p-4 scrollbar-hide">
                    <AnimatePresence>
                        {requests.map((item) => (
                            <motion.div
                                key={item._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.3 }}
                                className="bg-white shadow-md rounded-xl p-4 flex items-center space-x-4 w-[350px] border border-gray-200"
                            >
                                {/* Profile Image */}
                                <img
                                    src={item.image || "https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-image-182145777.jpg"}
                                    alt={item.firstName}
                                    className="h-20 w-20 rounded-full border-2 border-pink-500 object-cover"
                                />

                                {/* User Info */}
                                <div className="flex-1">
                                    <h2 className="text-lg font-semibold">{item.firstName} {item.lastName}, {calculateAge(item.DOB)}</h2>
                                    <p className="text-sm text-gray-600 mt-1">{item.bio}</p>

                                    {/* Action Buttons */}
                                    <div className="flex mt-3 space-x-3">
                                        <button
                                            onClick={() => handleAction(item._id, "accept")}
                                            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                                        >
                                            Accept
                                        </button>
                                        <button
                                            onClick={() => handleAction(item._id, "decline")}
                                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                                        >
                                            Decline
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            ) : (
                <div className="text-center text-gray-500 text-lg">No connection requests</div>
            )}
        </div>
    );
};

export default Connections;
