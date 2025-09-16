import React, { useState, useEffect } from "react";
import Visitors from './Visitors';
import VisitorProfile from './VisitorProfile';
import CreateNewPass from '../pass/CreateNewPass';
import localStorageManager from "../../utils/localStorageManager";

const Visitor = () => {
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [createNewPassModalOpen, setCreateNewPassModalOpen] = useState(false);
  const [visitorData, setVisitorData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleActionClick = (action, visitor = null) => {
    if (visitor) setSelectedVisitor(visitor);
    switch (action) {
      case 'view':
        setViewModalOpen(true);
        break;
      case 'pass':
        setCreateNewPassModalOpen(true);
        setViewModalOpen(false);
        break;
      default:
        console.log("Unhandled action:", action);
    }
  };

  const normalizeVisitor = (v) => ({
    id: v.id,
    first_name: v.first_name ?? v.firstName ?? '',
    last_name: v.last_name ?? v.lastName ?? '',
    visitor_type: v.visitor_type ?? v.type ?? '',
    address: v.address ?? '',
    phone: v.phone ?? v.phoneNumber ?? '',
    email: v.email ?? '',
    gov_id_type: v.gov_id_type ?? v.govIdType ?? v.gov_idType ?? v.govId_type ?? '',
    gov_id_no: v.gov_id_no ?? v.govIdNo ?? v.gov_idNo ?? v.govId_no ?? '',
    blood_group: v.blood_group ?? v.bloodGroup ?? '',
    is_blacklisted: v.is_blacklisted ?? v.blacklisted ?? false,
    image: v.image ?? null,
    created_on: v.created_on ?? v.createdOn ?? '',
    updated_on: v.updated_on ?? v.updatedOn ?? '',
  });

  const fetchData = () => {
    setIsLoading(true);
    const visitors = localStorageManager.getVisitors() || [];
    const normalized = visitors.map(normalizeVisitor);
    setVisitorData(normalized);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <Visitors visitors={visitorData} isLoading={isLoading} onActionClick={handleActionClick} />
      {selectedVisitor && (
        <>
          <VisitorProfile open={viewModalOpen} onClose={() => setViewModalOpen(false)} visitor={normalizeVisitor(selectedVisitor)} onActionClick={handleActionClick} />
          <CreateNewPass open={createNewPassModalOpen} onClose={() => setCreateNewPassModalOpen(false)} visitor={normalizeVisitor(selectedVisitor)} fetchData={fetchData} />
        </>
      )}
    </div>
  );
};

export default Visitor;

