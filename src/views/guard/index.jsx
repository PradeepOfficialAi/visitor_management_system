import React, { useState, useEffect, useRef } from 'react';
import test from "../../assets/images/no-data.png";
import defaultImage from "../../assets/images/no-data.png";
import localStorageManager from "../../utils/localStorageManager";

const ProfileCardRight = ({ visitorObj }) => (
  <div className="p-4 flex flex-col items-center rounded-lg bg-gray-200 shadow overflow-hidden gap-2">
    <div className="w-full h-3/6 flex justify-center items-center overflow-hidden">
      <img
        className="rounded-full border-4 p-1 border-gray-300 bg-gray-100 object-cover"
        style={{ width: '200px', height: '200px' }}
        src={"data:image/png;base64,"+(visitorObj.image)  || defaultImage}
        alt={visitorObj.first_name}
      />
    </div>
    <div className="w-full h-3/6 p-4 bg-gray-300 items-center justify-center rounded-lg overflow-y-auto">
      {visitorObj.first_name ? (
        <>
          <div className="grid grid-cols-1 gap-2 items-center">
            <div>
              <label htmlFor="fullName" className="text-sm font-semibold text-gray-800">Full Name:</label>
              <span id="fullName" className="mt-2 text-blue-700"> {visitorObj.first_name} {visitorObj.last_name}</span>
            </div>
            <div>
              <label htmlFor="govIdType" className="text-sm font-semibold text-gray-800">Govt ID Type:</label>
              <span id="govIdType" className="mt-2 text-blue-700"> {visitorObj.gov_id_type}</span>
            </div>
            <div>
              <label htmlFor="govIdNo" className="text-sm font-semibold text-gray-800">Govt ID Number:</label>
              <span id="govIdNo" className="mt-2 text-blue-700"> {visitorObj.gov_id_no}</span>
            </div>
            <div>
              <label htmlFor="visitorEmail" className="text-sm font-semibold text-gray-800">Visitor Email:</label>
              <span id="visitorEmail" className="mt-2 text-blue-700"> {visitorObj.email}</span>
            </div>
            <div>
              <label htmlFor="visitorPhone" className="text-sm font-semibold text-gray-800">Visitor Phone:</label>
              <span id="visitorPhone" className="mt-2 text-blue-700"> {visitorObj.phone}</span>
            </div>
          </div>
        </>
      ) : (
        <h1 className="text-2xl font-semibold text-gray-800">No Data Available!</h1>
      )}
    </div>
  </div>
);

const ProfileCardLeft = ({ visitorObj }) => (
  <div className="p-4 flex flex-row items-center bg-gray-200 rounded-lg shadow overflow-hidden gap-4">
    <div className="w-4/6 h-96 flex justify-center items-center overflow-hidden">
      <img
        className="rounded-full border-4 p-1 border-gray-300 bg-gray-100 object-cover"
        style={{ width: '350px', height: '350px' }}
        src={"data:image/png;base64,"+(visitorObj.image) || defaultImage}
        alt={visitorObj.first_name}
      />
    </div>
    <div className="w-3/6 p-4 h-full bg-gray-300 items-center justify-center rounded-lg overflow-y-auto">
      {visitorObj.first_name ? (
        <>
          <div className="grid grid-cols-1 gap-3 items-center">
            <div>
              <label htmlFor="fullName" className="text-md font-semibold text-gray-800">Full Name: </label>
              <span id="fullName" className="mt-2 text-lg text-blue-700"> {visitorObj.first_name} {visitorObj.last_name}</span>
            </div>
            <div>
              <label htmlFor="govIdType" className="text-md font-semibold text-gray-800">Govt ID Type: </label>
              <span id="govIdType" className="mt-2 text-lg text-blue-700"> {visitorObj.gov_id_type}</span>
            </div>
            <div>
              <label htmlFor="govIdNo" className="text-md font-semibold text-gray-800">Govt ID Number: </label>
              <span id="govIdNo" className="mt-2 text-lg text-blue-700"> {visitorObj.gov_id_no}</span>
            </div>
            <div>
              <label htmlFor="visitorEmail" className="text-md font-semibold text-gray-800">Visitor Email: </label>
              <span id="visitorEmail" className="mt-2 text-lg text-blue-700"> {visitorObj.email}</span>
            </div>
            <div>
              <label htmlFor="visitorPhone" className="text-md font-semibold text-gray-800">Visitor Phone: </label>
              <span id="visitorPhone" className="mt-2 text-lg text-blue-700"> {visitorObj.phone}</span>
            </div>
            <div>
              <label htmlFor="visitorType" className="text-md font-semibold text-gray-800">Visitor Type: </label>
              <span id="visitorType" className="mt-2 text-lg text-blue-700"> {visitorObj.visitor_type}</span>
            </div>
            <div>
              <label htmlFor="reader" className="text-md font-semibold text-gray-800">Reader: </label>
              <span id="reader" className="mt-2 text-lg text-blue-700"> {visitorObj.reader}</span>
            </div>
          </div>
        </>
      ) : (
        <h1 className="text-2xl font-semibold text-gray-800">No Data Available!</h1>
      )}
    </div>
  </div>
);

const Guard = () => {
  const placeholderData = new Array(6).fill({
    imageUrl: test,
    name: 'Jane Cooper',
    title: 'Paradigm Representative',
    admin: true,
  });

  const [profiles, setProfiles] = useState(placeholderData);

  useEffect(() => {
    const interval = setInterval(() => {
      const db = localStorageManager.getDB();
      const passes = db.passes.map(pass => {
        return {
          ...pass.visitor,
          reader: db.readers.find(r => r.id === pass.reader_id)?.name || 'N/A'
        }
      });
      setProfiles([...passes, ...placeholderData.slice(passes.length)]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div  className="flex flex-col h-full" style={{height:"95%"}}>
      <div className="flex justify-center items-center">
        <div
          className={`h-1 w-screen rounded-lg bg-green-500`}
        />
      </div>
      <div className="flex flex-row p-3 gap-16 flex-grow overflow-hidden">
        <div className="w-3/5 grid grid-row-2 gap-4">
          {profiles.slice(0, 2).map((profile, index) => (
            <ProfileCardLeft visitorObj={profile} key={index} />
          ))}
        </div>
        <div className="w-3/5 grid grid-cols-2 gap-4">
          {profiles.slice(2).map((profile, index) => (
            <ProfileCardRight visitorObj={profile} key={index} />
          ))}
        </div>
      </div>
      
    </div>
  );
};

export default Guard;

