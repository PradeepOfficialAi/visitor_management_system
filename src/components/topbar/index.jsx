import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext.jsx";
import Notification from "../../components/notification";
import Profile from "../../views/auth/Profile.jsx";

const Topbar = () => {
  let history = useNavigate();
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const { setUser } = useContext(UserContext);

  const handleLogout = () => {
    localStorage.clear();
    setUser();
    history("/login");
    Notification.showSuccessMessage(
      "Logout Successfully!",
      "You have been logged out successfully."
    );
  };

  let username = localStorage.getItem("user_name");
  let userimage = localStorage.getItem("image");

  useEffect(() => {
    username = localStorage.getItem("user_name");
    userimage = localStorage.getItem("image");
  });

  return (
    <>
      <div className="flex justify-between items-center bg-secondary-dark p-4 shadow-md">
        <div class="h-full flex items-center font-bold text-xl text-white">
          VISITOR MANAGEMENT SYSTEM
        </div>

        {localStorage.getItem("token") && (
          <div className="flex items-center space-x-2">
            <div
              className="flex items-center space-x-2 bg-primary-dark rounded-full p-1 transform scale-90 shadow-md min-w-[130px]"
              onClick={() => setProfileModalOpen(true)}
            >
              <div className="w-8 h-8 border-2 border-gray-300 rounded-full overflow-hidden bg-accent-blue flex justify-center items-center">
                {userimage != "null" ? (
                  <img
                    src={`data:image/jpeg;base64,${localStorage.getItem(
                      "image"
                    )}`}
                    alt="User"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white">
                    {username ? username.charAt(0).toUpperCase() : "N"}
                  </span>
                )}
              </div>
              <span className="text-white p-1">{username}</span>
            </div>

            <button
              className="bg-accent-blue hover:bg-blue-700 text-white py-2 px-4 rounded-3xl shadow-md flex items-center text-sm"
              onClick={() => handleLogout()}
            >
              Logout
            </button>
          </div>
        )}
      </div>

      <Profile
        open={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />
    </>
  );
};
export default Topbar;
