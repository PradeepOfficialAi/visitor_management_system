import React, { useState, useEffect } from "react";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import "chart.js/auto";
import localStorageManager from "../../utils/localStorageManager";
import { CircularProgress } from "@mui/material";

const Dashboard = () => {
  const [passTimeLeftData, setPassTimeLeftData] = useState([]);
  const [todayVisitorData, setTodayVisitorData] = useState({});
  const [weeklyVisitorData, setWeeklyVisitorData] = useState({});
  const [visitorInZonesData, setVisitorInZonesData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const db = localStorageManager.getDB();
    if (db) {
      // Pass Time Left Data
      const passes = db.passes.map(pass => {
        return {
          ...pass,
          pass_created_at: pass.created_on,
          valid_upto: pass.valid_until,
          visitor_name: `${pass.visitor.first_name} ${pass.visitor.last_name}`,
          phone: pass.visitor.phone,
          gov_id_type: pass.visitor.gov_id_type,
          gov_id_no: pass.visitor.gov_id_no,
          image: pass.visitor.image,
        }
      });
      setPassTimeLeftData(passes);

      // Today Visitor Data
      const today = new Date().toISOString().slice(0, 10);
      const todayVisits = db.passes.filter(pass => pass.created_on.slice(0, 10) === today);
      const todayVisitorCount = {};
      for (let i = 9; i <= 18; i++) {
        const hour = i < 10 ? `0${i}` : i;
        todayVisitorCount[`${today} ${hour}:00:00`] = 0;
        todayVisitorCount[`${today} ${hour}:30:00`] = 0;
      }
      todayVisits.forEach(pass => {
        const hour = new Date(pass.created_on).getHours();
        const minutes = new Date(pass.created_on).getMinutes();
        const key = `${today} ${hour < 10 ? `0${hour}` : hour}:${minutes < 30 ? '00' : '30'}:00`;
        if (todayVisitorCount[key] !== undefined) {
          todayVisitorCount[key]++;
        }
      });
      setTodayVisitorData(todayVisitorCount);

      // Weekly Visitor Data
      const weeklyVisits = {};
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateString = date.toISOString().slice(0, 10);
        weeklyVisits[dateString] = 0;
      }
      db.passes.forEach(pass => {
        const dateString = pass.created_on.slice(0, 10);
        if (weeklyVisits[dateString] !== undefined) {
          weeklyVisits[dateString]++;
        }
      });
      setWeeklyVisitorData(weeklyVisits);

      // Visitor In Zones Data
      const zonesCount = {};
      db.passes.forEach(pass => {
        pass.zones_allowed.forEach(zone => {
          if (zonesCount[zone.name]) {
            zonesCount[zone.name]++;
          } else {
            zonesCount[zone.name] = 1;
          }
        });
      });
      setVisitorInZonesData(zonesCount);
      setIsLoading(false);
    }
  }, []);

  function calculateMinutesBetweenDates(startTime, endTime) {
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);
    const diffInMs = endDate - startDate;
    const minutes = diffInMs / 60000;
    return Math.max(0, Math.round(minutes));
  }

  const currentTime = new Date().toISOString();

  const lineChartData = {
    labels: Object.keys(todayVisitorData),
    datasets: [
      {
        label: "Visits",
        data: Object.values(todayVisitorData),
        fill: true,
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        tension: 0.4,
      },
    ],
  };

  const barChartData = {
    labels: Object.keys(weeklyVisitorData),
    datasets: [
      {
        label: "Weekly Visitors",
        data: Object.values(weeklyVisitorData),
        backgroundColor: "rgba(59, 130, 246, 0.5)",
      },
    ],
  };

  const doughnutChartData = {
    labels: Object.keys(visitorInZonesData),
    datasets: [
      {
        data: Object.values(visitorInZonesData),
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(53, 162, 235, 0.5)",
          "rgba(75, 192, 192, 0.5)",
        ],
        hoverOffset: 4,
      },
    ],
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><CircularProgress /></div>;
  }

  return (
    <div className="p-6">
      {/* Chart row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* Weekly Visitors */}
        <div className="bg-white border rounded shadow p-4 h-80">
          <h2 className="text-lg font-bold mb-3">Weekly Visitors</h2>
          <div className="h-64 p-4">
            <Bar data={barChartData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        {/* Today Visits */}
        <div className="bg-white border rounded shadow p-4 h-80">
          <h2 className="text-lg font-bold mb-3">Today's Visitors</h2>
          <div className="h-64 p-4">
            <Line
              data={lineChartData}
              options={{ maintainAspectRatio: false }}
            />
          </div>
        </div>

        {/* Number of People in Zones */}
        <div className="bg-white border rounded shadow p-4 h-80">
          <h2 className="text-lg font-bold mb-3">People in Zones</h2>
          <div className="h-64 p-4">
            <Doughnut
              data={doughnutChartData}
              options={{ maintainAspectRatio: false }}
            />
          </div>
        </div>
      </div>

      {/* Visitors /action row */}
      <div className="grid gap-4 mb-8">
        <div className="md:col-span-2 bg-white border rounded shadow">
          <h2 className="text-lg font-bold p-4 border-b">
            Today's visitors ({passTimeLeftData?.length ? passTimeLeftData?.length : 0})
          </h2>
          <div className="p-4 overflow-auto" style={{ maxHeight: "340px" }}>
            <table className="min-w-full">
              <thead>
                <tr className="text-left">
                  <th className="px-2 pb-2 text-center">Image</th>
                  <th className="px-6 pb-2">Name</th>
                  <th className="px-6 pb-2">Remaining Time</th>
                  <th className="px-6 pb-2">Phone No</th>
                  <th className="px-6 pb-2">Government Type</th>
                  <th className="px-6 pb-2">Government ID</th>
                </tr>
              </thead>
              <tbody style={{ maxHeight: "320px", overflowY: "auto" }}>
                {passTimeLeftData?.map((visitor, index) => {
                  const totalMinutes = calculateMinutesBetweenDates(
                    visitor.pass_created_at,
                    visitor.valid_upto
                  );
                  const remainingMinutes = calculateMinutesBetweenDates(
                    currentTime,
                    visitor.valid_upto
                  );
                  const validProgressPercent =
                    ((totalMinutes - remainingMinutes) / totalMinutes) * 100;
                  const progressPercent =
                    isNaN(validProgressPercent) || validProgressPercent < 0
                      ? 100
                      : validProgressPercent;

                  return (
                    <tr
                      key={visitor.phone}
                      className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                    >
                      <td className="py-1 ">
                        <div className="flex justify-center">
                          <div className="inline-block h-16 w-16 border-2 border-gray-300 rounded-full overflow-hidden bg-customGreen">
                            {visitor.image ? (
                              <img
                                src={`data:image/jpeg;base64,${visitor.image}`}
                                alt="User"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center text-white bg-customGreen">
                                {visitor.visitor_name
                                  ? visitor.visitor_name.charAt(0).toUpperCase()
                                  : "N"}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">{visitor.visitor_name}</td>
                      <td className="px-6 py-4 relative">
                        <div className="w-3/4 bg-gray-200 rounded-full h-2.5 group">
                          <div
                            className="bg-blue-500 h-2.5 rounded-full"
                            style={{ width: `${100 - progressPercent}%` }}
                          ></div>
                          <div className="absolute w-auto p-2 mt-2 text-xs text-white bg-customGreen rounded-md opacity-0 group-hover:opacity-100">
                            {`${remainingMinutes} minutes left`}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">{visitor.phone}</td>
                      <td className="px-6 py-4">{visitor.gov_id_type.replace('_', ' ')}</td>
                      <td className="px-6 py-4">{visitor.gov_id_no}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
