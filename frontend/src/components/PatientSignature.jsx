import { useRef, useState } from "react";
import "../styles/patientSignature.css";

function PatientSignature({ onSave, onCancel }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  function getCanvasPosition(event) {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }

  function startDrawing(event) {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const { x, y } = getCanvasPosition(event);

    ctx.beginPath();
    ctx.moveTo(x, y);

    setIsDrawing(true);
  }

  function draw(event) {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const { x, y } = getCanvasPosition(event);

    ctx.lineTo(x, y);
    ctx.stroke();
  }

  function stopDrawing() {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.closePath();
    setIsDrawing(false);
  }

  function clearSignature() {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function saveSignature() {
    const canvas = canvasRef.current;

    const signature = canvas.toDataURL("image/png");

    onSave(signature);
  }

  return (
    <div className="patient-signature-overlay">
      <div className="patient-signature-modal">
        <h2>Patient Signature</h2>

        <p>
          Please sign below to acknowledge the completed treatment session and
          payment.
        </p>

        <div className="patient-signature-canvas-container">
          <canvas
            ref={canvasRef}
            width={700}
            height={250}
            onPointerDown={startDrawing}
            onPointerMove={draw}
            onPointerUp={stopDrawing}
            onPointerLeave={stopDrawing}
          />
        </div>

        <div className="patient-signature-actions">
          <button
            type="button"
            className="patient-signature-clear"
            onClick={clearSignature}
          >
            Clear
          </button>

          <div>
            <button
              type="button"
              className="patient-signature-cancel"
              onClick={onCancel}
            >
              Cancel
            </button>

            <button
              type="button"
              className="patient-signature-save"
              onClick={saveSignature}
            >
              Save Signature
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PatientSignature;
