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

  const fetchData = () => {
    setIsLoading(true);
    const visitors = localStorageManager.getVisitors();
    setVisitorData(visitors);
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
          <VisitorProfile open={viewModalOpen} onClose={() => setViewModalOpen(false)} visitor={selectedVisitor} onActionClick={handleActionClick} />
          <CreateNewPass open={createNewPassModalOpen} onClose={() => setCreateNewPassModalOpen(false)} visitor={selectedVisitor} fetchData={fetchData} />
        </>
      )}
    </div>
  );
};

export default Visitor;

