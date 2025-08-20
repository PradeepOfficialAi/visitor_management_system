import React, { useState, useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import localStorageManager from "../../utils/localStorageManager";

const Report = () => {
    const [reportType, setReportType] = useState("");
    const [selectedGadget, setSelectedGadget] = useState("");
    const [selectedDetailType, setSelectedDetailType] = useState("");
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleView = () => {
        setIsLoading(true);
        const db = localStorageManager.getDB();
        let simplifiedData = [];

        if (reportType === "configuration") {
            if (selectedGadget === "reader") {
                simplifiedData = db.readers.map((item) => ({
                    adam_name: db.adams.find(a => a.id === item.adam)?.name || 'N/A',
                    zone_name: db.zones.find(z => z.id === item.zone)?.zone_name || 'N/A',
                    moxa_ip: item.moxa_ip,
                    reader_type: item.reader_type,
                    com_port: item.com_port ? item.com_port : "N/A",
                }));
            }
            if (selectedGadget === "adam") {
                simplifiedData = db.adams.map((item) => ({
                    adam_name: item.name,
                    ip: item.ip,
                    port: item.port,
                    address: item.address,
                }));
            }
            if (selectedGadget === "zone") {
                simplifiedData = db.zones.map((item) => ({
                    zone_name: item.zone_name,
                    allow_re_entry: item.allow_re_entry ? "Yes" : "No",
                    created_on: new Date(item.created_on).toLocaleString('en-IN', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false,
                    }),
                    updated_on: new Date(item.updated_on).toLocaleString('en-IN', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false,
                    }),
                }));
            }
            if (selectedGadget === "key") {
                simplifiedData = db.keys.map((item) => ({
                    RFID_key: item.RFID_key,
                    blacklisted: item.blacklisted ? "Yes" : "No",
                    is_assigned: item.is_assigned ? "Yes" : "No",
                    visitor_pass: item.visitor_pass,
                }));
            }
        }
        if (reportType === "user") {
            if (selectedDetailType === "userdetails") {
                simplifiedData = db.users.map((item) => ({
                    image: `data:image/jpeg;base64,${item.image}`,
                    user_name: item.username,
                    phone: item.phone,
                    employee_code: item.employee_code,
                    last_login: new Date(item.last_login).toLocaleString('en-IN', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false,
                    }),
                    department: item.department,
                    work_location: item.work_location,
                }));
            }
        }
        setData(simplifiedData);
        setIsLoading(false);
    };

    const handleReportTypeChange = (e) => {
        setReportType(e.target.value);
        setSelectedGadget("");
        setSelectedDetailType("");
        setData([]);
    };

    const handleGadgetChange = (e) => {
        setSelectedGadget(e.target.value);
        setData([]);
    };

    const handleDetailTypeChange = (e) => {
        setSelectedDetailType(e.target.value);
        setData([]);
    };

    const headers = data.length > 0 ? Object.keys(data[0]) : [];

    return (
        <div className="flex flex-col h-screen">
            <div className="flex flex-row p-4 shadow-md">
                <div className="flex flex-wrap items-center gap-4">
                    <select
                        className="appearance-none border border-customGreen rounded-3xl bg-white py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-700"
                        onChange={handleReportTypeChange}
                        value={reportType}
                    >
                        <option value="">Select Report Type</option>
                        <option value="configuration">Configuration Report</option>
                        <option value="user">User Report</option>
                    </select>

                    {reportType === "configuration" && (
                        <div>
                            <select
                                className="appearance-none border border-customGreen rounded-3xl bg-white py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-700"
                                onChange={handleGadgetChange}
                                value={selectedGadget}
                            >
                                <option value="">Select Gadget</option>
                                <option value="reader">Reader</option>
                                <option value="key">Key</option>
                                <option value="zone">Zone</option>
                                <option value="adam">Adam</option>
                            </select>
                        </div>
                    )}

                    {reportType === "user" && (
                        <>
                            <div>
                                <select
                                    className="appearance-none border border-customGreen rounded-3xl bg-white py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-700"
                                    onChange={handleDetailTypeChange}
                                    value={selectedDetailType}
                                >
                                    <option value="">Select type</option>
                                    <option value="userdetails">Users Detail</option>
                                </select>
                            </div>
                        </>
                    )}
                </div>

                <div className="flex justify-between items-center m-6">
                    <button
                        className="bg-customGreen hover:bg-green-700 text-white rounded-3xl shadow-md flex items-center py-2 px-6"
                        onClick={handleView}
                    >
                        View Report
                    </button>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <CircularProgress />
                </div>
            ) : data.length > 0 ? (
                <div className="flex-grow overflow-auto p-4">
                    <table className="min-w-full leading-normal">
                        <thead>
                            <tr>
                                {headers.map((header) => (
                                    <th
                                        key={header}
                                        className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                                    >
                                        {header.replace("_", " ")}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item, index) => (
                                <tr key={index}>
                                    {headers.map((header) => (
                                        <td
                                            key={header}
                                            className="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                                        >
                                            {header === 'image' ? (
                                                <div className="inline-block h-16 w-16 border-2 border-gray-300 overflow-hidden bg-customGreen">
                                                    {item[header] ? (
                                                        <img src={item[header]} alt="Image" />
                                                    ) : (
                                                        <div className="h-full w-full flex items-center justify-center text-white bg-customGreen">
                                                            N/A
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                item[header] || "N/A"
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="flex justify-center items-center h-64">
                    <p>No data found.</p>
                </div>
            )}
        </div>
    );
};

export default Report;

