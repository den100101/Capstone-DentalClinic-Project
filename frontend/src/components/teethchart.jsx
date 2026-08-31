import "../styles/teethChart.css";
import TeethModal from "./teethmodal";
import UpdateTeethModal from "./UpdateTeethModal";
import ToothPopover from "./ToothPopover";
import { useState, useEffect } from "react";

function TeethChart({ selectedPatient, toothRecords, refreshRecords }) {
  const API_URL = import.meta.env.VITE_API_URL;

  const [markedTeeth, setMarkedTeeth] = useState(null);
  const [teethModal, setTeethModal] = useState(false);
  const [hoveredTooth, setHoveredTooth] = useState(null);
  const [updateModal, setUpdateModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const upperRight = [18, 17, 16, 15, 14, 13, 12, 11];
  const upperLeft = [21, 22, 23, 24, 25, 26, 27, 28];
  const lowerLeft = [31, 32, 33, 34, 35, 36, 37, 38];
  const lowerRight = [48, 47, 46, 45, 44, 43, 42, 41];

  function openUpdateModal(record) {
    setSelectedRecord(record);
    setUpdateModal(true);
  }

  async function deleteRecord(id) {
    if (!window.confirm("Delete this tooth record?")) return;

    try {
      const response = await fetch(`${API_URL}/delete_tooth_record/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        refreshRecords();
      }
    } catch (error) {
      console.log(error);
    }
  }

  function renderRow(teeth) {
    return teeth.map((tooth) => {
      const record = toothRecords.find((r) => r.tooth_number === tooth);

      const hasRecord = !!record;

      return (
        <div
          key={tooth}
          className="tooth-wrapper"
          onMouseEnter={() => setHoveredTooth(tooth)}
          onMouseLeave={() => setHoveredTooth(null)}
        >
          <button
            className="tooth"
            onClick={() => {
              if (!hasRecord) {
                setMarkedTeeth(tooth);
                setTeethModal(true);
              }
            }}
          >
            <span className="tooth-number">{tooth}</span>

            <img
              src="/Images/tooth.png"
              alt={`Tooth ${tooth}`}
              className={hasRecord ? "tooth-image red" : "tooth-image"}
            />
          </button>

          {hoveredTooth === tooth && record && (
            <ToothPopover
              tooth={tooth}
              record={record}
              onUpdate={openUpdateModal}
              onDelete={deleteRecord}
            />
          )}
        </div>
      );
    });
  }

  return (
    <div className="teeth-chart">
      <h2>Dental Chart</h2>

      <div className="teeth-row">
        {renderRow(upperRight)}
        <div className="gap"></div>
        {renderRow(upperLeft)}
      </div>

      <div className="teeth-row">
        {renderRow(lowerLeft)}
        <div className="gap"></div>
        {renderRow(lowerRight)}
      </div>

      {teethModal && (
        <TeethModal
          closeModal={setTeethModal}
          patientId={selectedPatient.id}
          tooth={markedTeeth}
          onRecordAdded={refreshRecords}
        />
      )}
      {updateModal && selectedRecord && (
        <UpdateTeethModal
          closeModal={setUpdateModal}
          record={selectedRecord}
          onRecordUpdated={refreshRecords}
        />
      )}
    </div>
  );
}

export default TeethChart;
