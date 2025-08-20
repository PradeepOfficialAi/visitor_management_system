import React, { useState, useEffect } from "react";
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
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
import CircularProgress from "@mui/material/CircularProgress";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import Pagination from "../../components/pagination/index.jsx";
import localStorageManager from "../../utils/localStorageManager.js";

const Visitors = ({ visitors, isLoading, onActionClick }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentSelectedVisitor, setCurrentSelectedVisitor] = useState(null);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filteredVisitors, setFilteredVisitors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [addVisitorModalOpen, setAddVisitorModalOpen] = useState(false);
  const [updateVisitorModalOpen, setUpdateVisitorModalOpen] = useState(false);
  const [newVisitorData, setNewVisitorData] = useState({ first_name: "", last_name: "", phone: "", email: "" });
  const [updateVisitorData, setUpdateVisitorData] = useState({ id: null, first_name: "", last_name: "", phone: "", email: "" });

  useEffect(() => {
    const filtered = visitors?.filter(
      (visitor) =>
        `${visitor.first_name} ${visitor.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        visitor.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        visitor.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredVisitors(filtered);
  }, [searchTerm, visitors]);

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
  };

  const handlePageSizeChange = (event) => {
    setItemsPerPage(event.target.value);
    setCurrentPage(1);
  };

  const handleClick = (event, visitor) => {
    setAnchorEl(event.currentTarget);
    setCurrentSelectedVisitor(visitor);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = (visitor) => {
    setCurrentSelectedVisitor(visitor);
    setShowDeleteAlert(true);
    handleClose();
  };

  const confirmDelete = () => {
    localStorageManager.deleteVisitor(currentSelectedVisitor.id);
    setShowDeleteAlert(false);
    window.location.reload();
  };

  const handleAddVisitor = () => {
    localStorageManager.addVisitor({ ...newVisitorData, id: Date.now() });
    setAddVisitorModalOpen(false);
    window.location.reload();
  };

  const handleUpdateVisitor = () => {
    localStorageManager.updateVisitor(updateVisitorData);
    setUpdateVisitorModalOpen(false);
    window.location.reload();
  };

  const openUpdateModal = (visitor) => {
    setUpdateVisitorData(visitor);
    setUpdateVisitorModalOpen(true);
  };

  const indexOfLastVisitor = currentPage * itemsPerPage;
  const indexOfFirstVisitor = indexOfLastVisitor - itemsPerPage;
  const currentVisitors = filteredVisitors?.slice(indexOfFirstVisitor, indexOfLastVisitor);
  const totalPages = Math.ceil(filteredVisitors?.length / itemsPerPage);

  return (
    <div style={{ marginBottom: "55px" }}>
      <div className="flex justify-between items-center m-6">
        <div className="flex items-center space-x-2">
          <input
            className="appearance-none border border-customGreen rounded-3xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-700"
            type="text"
            placeholder="Search by name, phone, or email"
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
        <div className="flex space-x-3">
          <button
            className="flex items-center bg-customGreen hover:bg-green-700 text-white py-1 px-4 rounded-3xl"
            onClick={() => setAddVisitorModalOpen(true)}
          >
            <AddIcon className="h-4 w-5 mr-2" />
            ADD NEW
          </button>
        </div>
      </div>
      {isLoading ? (
        <Box
          style={{
            height: "50vh",
            minHeight: "50vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </Box>
      ) : currentVisitors?.length > 0 ? (
        <div className="bg-white shadow-md rounded my-6">
          <table className="text-left w-full border-collapse">
            <thead>
              <tr>
                <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light text-center">
                  Visitor Image
                </th>
                <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">
                  Visitor Name
                </th>
                <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">
                  Phone
                </th>
                <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">
                  Email
                </th>
                <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {currentVisitors?.map((visitor, index) => (
                <tr key={visitor.id} className="hover:bg-grey-lighter">
                  <td className="py-1 px-1 border-b border-grey-light">
                    <div className="flex justify-center">
                      <div className="inline-block h-16 w-16 border-2 border-gray-300 rounded-full overflow-hidden bg-customGreen">
                        {visitor.image ? (
                          <img src={`data:image/jpeg;base64,${visitor.image}`} alt="User" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-white bg-customGreen">
                            {visitor.first_name ? visitor.first_name.charAt(0).toUpperCase() : "N"}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 border-b border-grey-light">
                    {visitor.first_name} {visitor.last_name}
                  </td>
                  <td className="py-4 px-6 border-b border-grey-light">{visitor.phone}</td>
                  <td className="py-4 px-6 border-b border-grey-light">{visitor.email}</td>
                  <td className="py-4 px-6 border-b border-grey-light">
                    <IconButton
                      aria-label="more"
                      aria-controls="long-menu"
                      aria-haspopup="true"
                      onClick={(event) => handleClick(event, visitor)}
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
                      <MenuItem
                        onClick={() => {
                          onActionClick("view", currentSelectedVisitor);
                          handleClose();
                        }}
                      >
                        <ListItemIcon>
                          <VisibilityIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="View" />
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          openUpdateModal(currentSelectedVisitor);
                          handleClose();
                        }}
                      >
                        <ListItemIcon>
                          <EditIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Update" />
                      </MenuItem>
                      <MenuItem onClick={() => handleDelete(currentSelectedVisitor)}>
                        <ListItemIcon>
                          <DeleteIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Delete" />
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          onActionClick("pass", currentSelectedVisitor);
                          handleClose();
                        }}
                      >
                        <ListItemIcon>
                          <CreditCardIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Generate Pass" />
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
          <p>No Visitor found.</p>
        </Box>
      )}
      <Alert
        open={showDeleteAlert}
        onClose={() => setShowDeleteAlert(false)}
        title="Confirm Delete"
        message="Are you sure you want to delete this Visitor?"
        buttonText="Delete"
        buttonColor="red"
        onButtonClick={confirmDelete}
      />
      <Dialog open={addVisitorModalOpen} onClose={() => setAddVisitorModalOpen(false)}>
        <DialogTitle>Add New Visitor</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="First Name"
            type="text"
            fullWidth
            value={newVisitorData.first_name}
            onChange={(e) => setNewVisitorData({ ...newVisitorData, first_name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Last Name"
            type="text"
            fullWidth
            value={newVisitorData.last_name}
            onChange={(e) => setNewVisitorData({ ...newVisitorData, last_name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Phone"
            type="text"
            fullWidth
            value={newVisitorData.phone}
            onChange={(e) => setNewVisitorData({ ...newVisitorData, phone: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            value={newVisitorData.email}
            onChange={(e) => setNewVisitorData({ ...newVisitorData, email: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddVisitorModalOpen(false)}>Cancel</Button>
          <Button onClick={handleAddVisitor}>Add</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={updateVisitorModalOpen} onClose={() => setUpdateVisitorModalOpen(false)}>
        <DialogTitle>Update Visitor</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="First Name"
            type="text"
            fullWidth
            value={updateVisitorData.first_name}
            onChange={(e) => setUpdateVisitorData({ ...updateVisitorData, first_name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Last Name"
            type="text"
            fullWidth
            value={updateVisitorData.last_name}
            onChange={(e) => setUpdateVisitorData({ ...updateVisitorData, last_name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Phone"
            type="text"
            fullWidth
            value={updateVisitorData.phone}
            onChange={(e) => setUpdateVisitorData({ ...updateVisitorData, phone: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            value={updateVisitorData.email}
            onChange={(e) => setUpdateVisitorData({ ...updateVisitorData, email: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUpdateVisitorModalOpen(false)}>Cancel</Button>
          <Button onClick={handleUpdateVisitor}>Update</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Visitors;
