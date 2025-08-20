import React, { useState, useEffect } from "react";
import {
  Box,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Select,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import Alert from "../../components/alert/index.jsx";
import Pagination from "../../components/pagination/index.jsx";
import localStorageManager from "../../utils/localStorageManager.js";

const Users = ({ users, isLoading, onActionClick }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentSelectedUser, setCurrentSelectedUser] = useState(null);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [addUserModalOpen, setAddUserModalOpen] = useState(false);
  const [updateUserModalOpen, setUpdateUserModalOpen] = useState(false);
  const [newUserData, setNewUserData] = useState({ username: "", first_name: "", last_name: "", user_type: "" });
  const [updateUserData, setUpdateUserData] = useState({ id: null, username: "", first_name: "", last_name: "", user_type: "" });

  useEffect(() => {
    const filtered = users?.filter(
      (user) =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
  };

  const handlePageSizeChange = (event) => {
    setItemsPerPage(event.target.value);
    setCurrentPage(1);
  };

  const handleClick = (event, user) => {
    setAnchorEl(event.currentTarget);
    setCurrentSelectedUser(user);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = (user) => {
    setCurrentSelectedUser(user);
    setShowDeleteAlert(true);
    handleClose();
  };

  const confirmDelete = () => {
    localStorageManager.deleteUser(currentSelectedUser.id);
    setShowDeleteAlert(false);
    window.location.reload();
  };

  const handleAddUser = () => {
    localStorageManager.addUser({ ...newUserData, id: Date.now() });
    setAddUserModalOpen(false);
    window.location.reload();
  };

  const handleUpdateUser = () => {
    localStorageManager.updateUser(updateUserData);
    setUpdateUserModalOpen(false);
    window.location.reload();
  };

  const openUpdateModal = (user) => {
    setUpdateUserData(user);
    setUpdateUserModalOpen(true);
  };

  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = filteredUsers?.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers?.length / itemsPerPage);

  return (
    <div>
      <div className="flex justify-between items-center m-6">
        <div className="flex items-center space-x-2">
          <input
            className="appearance-none border border-customGreen rounded-3xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-700"
            type="text"
            placeholder="Search UserName/Name"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <select
            value={itemsPerPage}
            onChange={handlePageSizeChange}
            className="border border-customGreen rounded-3xl bg-white py-2 px-3 text-gray-700 focus:outline-none"
          >
            {[5, 10, 20, 30, 50].map((size) => (
              <option key={size} value={size}>
                {size} per page
              </option>
            ))}
          </select>
        </div>
        <button
          className="flex items-center bg-customGreen hover:bg-green-700 text-white py-1 px-4 rounded-3xl"
          onClick={() => setAddUserModalOpen(true)}
        >
          <AddIcon className="h-4 w-5 mr-2" />
          ADD NEW
        </button>
      </div>
      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
          <CircularProgress />
        </Box>
      ) : currentUsers?.length > 0 ? (
        <div className="bg-white shadow-md rounded my-6">
          <table className="text-left w-full border-collapse">
            <thead>
              <tr>
                <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light text-center">
                  User Image
                </th>
                <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">
                  User Name
                </th>
                <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">
                  Name
                </th>
                <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">
                  User Type
                </th>
                <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {currentUsers?.map((user, index) => (
                <tr key={index} className="hover:bg-grey-lighter">
                  <td className="py-1 px-1 border-b border-grey-light">
                    <div className="flex justify-center">
                      <div className="inline-block h-16 w-16 border-2 border-gray-300 rounded-full overflow-hidden bg-customGreen">
                        {user.image ? (
                          <img src={`data:image/jpeg;base64,${user.image}`} alt="User" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-white bg-customGreen">
                            {user.username ? user.username.charAt(0).toUpperCase() : "N"}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 border-b border-grey-light">{user.username}</td>
                  <td className="py-4 px-6 border-b border-grey-light">
                    {user.first_name} {user.last_name}
                  </td>
                  <td className="py-4 px-6 border-b border-grey-light">{user.user_type}</td>
                  <td className="py-4 px-6 border-b border-grey-light">
                    <IconButton
                      aria-label="more"
                      aria-controls="long-menu"
                      aria-haspopup="true"
                      onClick={(event) => handleClick(event, user)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                    <Menu
                      id="long-menu"
                      anchorEl={anchorEl}
                      keepMounted
                      open={Boolean(anchorEl)}
                      onClose={handleClose}
                    >
                      <MenuItem onClick={() => {
                        onActionClick("view", currentSelectedUser);
                        handleClose();
                      }}>
                        <ListItemIcon>
                          <VisibilityIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="View" />
                      </MenuItem>
                      <MenuItem onClick={() => {
                        openUpdateModal(currentSelectedUser);
                        handleClose();
                      }}>
                        <ListItemIcon>
                          <EditIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Update" />
                      </MenuItem>
                      <MenuItem onClick={() => handleDelete(currentSelectedUser)}>
                        <ListItemIcon>
                          <DeleteIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Delete" />
                      </MenuItem>
                    </Menu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination currentPage={currentPage} totalPages={totalPages} paginate={setCurrentPage} />
        </div>
      ) : (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh", textAlign: "center" }}>
          <p>No users found.</p>
        </Box>
      )}
      <Alert
        open={showDeleteAlert}
        onClose={() => setShowDeleteAlert(false)}
        title="Confirm Delete"
        message="Are you sure you want to delete this user?"
        buttonText="Delete"
        buttonColor="red"
        onButtonClick={confirmDelete}
      />
      <Dialog open={addUserModalOpen} onClose={() => setAddUserModalOpen(false)}>
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Username"
            type="text"
            fullWidth
            value={newUserData.username}
            onChange={(e) => setNewUserData({ ...newUserData, username: e.target.value })}
          />
          <TextField
            margin="dense"
            label="First Name"
            type="text"
            fullWidth
            value={newUserData.first_name}
            onChange={(e) => setNewUserData({ ...newUserData, first_name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Last Name"
            type="text"
            fullWidth
            value={newUserData.last_name}
            onChange={(e) => setNewUserData({ ...newUserData, last_name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="User Type"
            type="text"
            fullWidth
            value={newUserData.user_type}
            onChange={(e) => setNewUserData({ ...newUserData, user_type: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddUserModalOpen(false)}>Cancel</Button>
          <Button onClick={handleAddUser}>Add</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={updateUserModalOpen} onClose={() => setUpdateUserModalOpen(false)}>
        <DialogTitle>Update User</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Username"
            type="text"
            fullWidth
            value={updateUserData.username}
            onChange={(e) => setUpdateUserData({ ...updateUserData, username: e.target.value })}
          />
          <TextField
            margin="dense"
            label="First Name"
            type="text"
            fullWidth
            value={updateUserData.first_name}
            onChange={(e) => setUpdateUserData({ ...updateUserData, first_name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Last Name"
            type="text"
            fullWidth
            value={updateUserData.last_name}
            onChange={(e) => setUpdateUserData({ ...updateUserData, last_name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="User Type"
            type="text"
            fullWidth
            value={updateUserData.user_type}
            onChange={(e) => setUpdateUserData({ ...updateUserData, user_type: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUpdateUserModalOpen(false)}>Cancel</Button>
          <Button onClick={handleUpdateUser}>Update</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Users;

