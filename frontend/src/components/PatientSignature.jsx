import { useRef, useState } from "react";
import "../styles/patientSignature.css";

function PatientSignature({ note, onSave, onCancel }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  function getCanvasPosition(event) {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    return {
      x: (event.clientX - rect.left) * (canvas.width / rect.width),
      y: (event.clientY - rect.top) * (canvas.height / rect.height),
    };
  }

  function startDrawing(event) {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const { x, y } = getCanvasPosition(event);

    canvas.setPointerCapture?.(event.pointerId);

    ctx.beginPath();
    ctx.moveTo(x, y);

    setIsDrawing(true);
    setHasSignature(true);
  }

  function draw(event) {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const { x, y } = getCanvasPosition(event);

    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.lineTo(x, y);
    ctx.stroke();
  }

  function stopDrawing() {
    if (!isDrawing) return;

    canvasRef.current.getContext("2d").closePath();
    setIsDrawing(false);
  }

  function clearSignature() {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  }

  function saveSignature() {
    if (!hasSignature) {
      alert("Please provide the patient's signature.");
      return;
    }

    const signature = canvasRef.current.toDataURL("image/png");

    onSave(signature);
  }

  return (
    <div className="patient-signature-overlay">
      <div className="patient-signature-modal">
        <h2>Patient Signature</h2>

        <p>
          Ask the patient to sign below.
          {note ? ` ${note}` : ""}
        </p>

        <div className="patient-signature-canvas-container">
          <canvas
            ref={canvasRef}
            width={700}
            height={250}
            onPointerDown={startDrawing}
            onPointerMove={draw}
            onPointerUp={stopDrawing}
            onPointerCancel={stopDrawing}
            onPointerLeave={stopDrawing}
            style={{ touchAction: "none" }}
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
