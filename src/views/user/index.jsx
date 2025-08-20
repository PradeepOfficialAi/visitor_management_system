import React, { useState, useEffect } from "react";
import Users from './Users';
import UserProfile from './UserProfile';
import localStorageManager from "../../utils/localStorageManager";

const User = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [userData, setUserData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleActionClick = (action, user = null) => {
    if (user) setSelectedUser(user);
    if (action === 'view') setViewModalOpen(true);
  };

  const fetchData = () => {
    setIsLoading(true);
    const users = localStorageManager.getUsers();
    setUserData(users);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div style={{marginBottom:"55px"}}>
      <Users users={userData} isLoading={isLoading} onActionClick={handleActionClick} />
      {selectedUser && (
        <UserProfile open={viewModalOpen} onClose={() => setViewModalOpen(false)} user={selectedUser} onActionClick={handleActionClick} />
      )}
    </div>
  );
};

export default User;
