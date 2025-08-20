import React, { useState, useEffect } from "react";
import { IconButton, Menu, MenuItem, ListItemIcon, ListItemText, CircularProgress } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import AddNewAdam from "./AddNewAdam";
import UpdateAdam from "./UpdateAdam";
import Pagination from "../../../components/pagination/index.jsx";
import localStorageManager from "../../../utils/localStorageManager";

const Adams = () => {
    const [adamsData, setAdamsData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [currentSelectedAdam, setCurrentSelectedAdam] = useState(null);
    const [showAddNewAdam, setShowAddNewAdam] = useState(false);
    const [showUpdateAdam, setShowUpdateAdam] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        setIsLoading(true);
        const db = localStorageManager.getDB();
        setAdamsData(db.adams);
        setFilteredData(db.adams);
        setIsLoading(false);
    };

    const handleSearch = (event) => {
        const value = event.target.value;
        setSearchTerm(value);
        const filtered = adamsData.filter(adam =>
            adam.name.toLowerCase().includes(value.toLowerCase()) ||
            adam.ip.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredData(filtered);
        setCurrentPage(1);
    };

    const handlePageSizeChange = (event) => {
        setItemsPerPage(parseInt(event.target.value, 10));
        setCurrentPage(1);
    };

    const handleClick = (event, adam) => {
        setAnchorEl(event.currentTarget);
        setCurrentSelectedAdam(adam);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const onActionClick = (action, adam) => {
        setCurrentSelectedAdam(adam);
        if (action === 'addNewAdam') {
            setShowAddNewAdam(true);
        } else if (action === 'update') {
            setShowUpdateAdam(true);
        } else if (action === 'delete') {
            const db = localStorageManager.getDB();
            db.adams = db.adams.filter(a => a.id !== adam.id);
            localStorageManager.saveDB(db);
            fetchData();
        }
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    return (
        <div style={{marginBottom:"55px"}}>
            <div className="flex justify-between items-center m-6">
                <div className="flex items-center space-x-2">
                    <input
                        className="appearance-none border border-customGreen rounded-3xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-700"
                        type="text"
                        placeholder="Search Adam Name"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                    <select
                        value={itemsPerPage}
                        onChange={handlePageSizeChange}
                        className="border border-customGreen rounded-3xl bg-white py-2 px-3 text-gray-700 focus:outline-none"
                    >
                        {[5, 10, 20, 30, 50].map(size => (
                            <option key={size} value={size}>{size} per page</option>
                        ))}
                    </select>
                </div>
                <button className="flex items-center bg-customGreen hover:bg-green-700 text-white py-1 px-4 rounded-3xl" onClick={() => onActionClick('addNewAdam')}>
                    <AddIcon className="h-4 w-5 mr-2" />
                    ADD NEW
                </button>
            </div>
            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <CircularProgress />
                </div>
            ) : currentItems.length > 0 ? (
                <div className="bg-white shadow-md rounded my-6">
                    <table className="text-left w-full border-collapse">
                        <thead>
                            <tr>
                                <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">ID</th>
                                <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">Name</th>
                                <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">IP</th>
                                <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">Port</th>
                                <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">Address</th>
                                <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((adam, index) => (
                                <tr key={index} className="hover:bg-grey-lighter">
                                    <td className="py-4 px-6 border-b border-grey-light">{adam.id}</td>
                                    <td className="py-4 px-6 border-b border-grey-light">{adam.name}</td>
                                    <td className="py-4 px-6 border-b border-grey-light">{adam.ip}</td>
                                    <td className="py-4 px-6 border-b border-grey-light">{adam.port}</td>
                                    <td className="py-4 px-6 border-b border-grey-light">{adam.address}</td>
                                    <td className="py-4 px-6 border-b border-grey-light">
                                        <IconButton aria-label="more" aria-controls="long-menu" aria-haspopup="true" onClick={(event) => handleClick(event, adam)}>
                                            <MoreVertIcon />
                                        </IconButton>
                                        <Menu id="long-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
                                            <MenuItem onClick={() => { onActionClick('update', currentSelectedAdam); handleClose(); }}>
                                                <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
                                                <ListItemText primary="Update" />
                                            </MenuItem>
                                            <MenuItem onClick={() => { onActionClick('delete', currentSelectedAdam); handleClose(); }}>
                                                <ListItemIcon><DeleteIcon fontSize="small" /></ListItemIcon>
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
                <div className="text-center py-10">
                    <p>No data found.</p>
                </div>
            )}
            {showAddNewAdam && <AddNewAdam open={showAddNewAdam} onClose={() => setShowAddNewAdam(false)} fetchData={fetchData} />}
            {showUpdateAdam && <UpdateAdam adamData={currentSelectedAdam} open={showUpdateAdam} onClose={() => setShowUpdateAdam(false)} fetchData={fetchData} />}
        </div>
    );
};

export default Adams;

