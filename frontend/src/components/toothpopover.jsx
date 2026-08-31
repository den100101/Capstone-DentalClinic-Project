import "../styles/toothPopover.css";

function ToothPopover({ tooth, record, onUpdate, onDelete }) {
  return (
    <div className="tooth-popover">
      <h4>Tooth {tooth}</h4>

      <div className="popover-info">
        <p>
          <strong>Condition:</strong> {record.condition}
        </p>

        <p>
          <strong>Treatment:</strong> {record.treatment}
        </p>
      </div>

      <div className="popover-buttons">
        <button className="update-btn" onClick={() => onUpdate(record)}>
          Update
        </button>

        <button className="delete-btn" onClick={() => onDelete(record.id)}>
          Delete
        </button>
      </div>
    </div>
  );
}

export default ToothPopover;
