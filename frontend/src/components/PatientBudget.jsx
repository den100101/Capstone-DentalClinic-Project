import "../styles/PatientBudget.css";

function PatientBudget({
  budget,
  mainBalance,
  setMainBalance,
  updating,
  updateMainBalance,
  loading,
}) {
  function formatCurrency(amount) {
    return `₱${Number(amount || 0).toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  if (loading) {
    return (
      <div className="patient-budget-container">
        <p>Loading budget...</p>
      </div>
    );
  }

  return (
    <div className="patient-budget-container">
      {/* BUDGET */}
      <div className="patient-budget-section">
        <h2>Budget</h2>

        {/* MAIN BALANCE */}
        <div className="patient-budget-main-balance">
          <h3>Main Balance Due</h3>

          <div className="patient-budget-edit">
            <span>₱</span>

            <input
              type="number"
              min="0"
              step="0.01"
              value={mainBalance}
              onChange={(e) => setMainBalance(e.target.value)}
            />

            <button
              type="button"
              onClick={updateMainBalance}
              disabled={updating}
            >
              {updating ? "Updating..." : "Update"}
            </button>
          </div>
        </div>

        {/* PAYMENT SUMMARY */}
        <div className="patient-budget-summary">
          <div className="patient-budget-summary-item">
            <h3>Total Paid</h3>

            <p>{formatCurrency(budget.total_paid)}</p>
          </div>

          <div className="patient-budget-summary-item">
            <h3>Remaining</h3>

            <p>{formatCurrency(budget.remaining)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PatientBudget;
