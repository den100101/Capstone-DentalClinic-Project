import "../styles/PatientBudget.css";

function PatientBudget({
  budget,
  mainBalance,
  setMainBalance,
  updating,
  updateMainBalance,
  loading,

  // NEW: Required payment before signing
  requiredPayment,
  setRequiredPayment,
  updatingRequiredPayment,
  updateRequiredPayment,
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

        {/* NEW: REQUIRED PAYMENT BEFORE SIGNING */}
        <div className="patient-budget-main-balance">
          <h3>Required Payment Before Signing</h3>

          <p>
            Set the minimum amount the patient must have paid before signing
            the required document.
          </p>

          <div className="patient-budget-edit">
            <span>₱</span>

            <input
              type="number"
              min="0"
              step="0.01"
              value={requiredPayment ?? ""}
              onChange={(e) => setRequiredPayment(e.target.value)}
              placeholder="Enter required amount"
            />

            <button
              type="button"
              onClick={updateRequiredPayment}
              disabled={updatingRequiredPayment}
            >
              {updatingRequiredPayment ? "Updating..." : "Update"}
            </button>
          </div>

          <p>
            Current requirement:{" "}
            <strong>{formatCurrency(requiredPayment)}</strong>
          </p>
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

        {/* PAYMENT REQUIREMENT STATUS */}
        <div className="patient-budget-main-balance">
          <h3>Signing Payment Status</h3>

          <p>
            Paid: {formatCurrency(budget.total_paid)}
          </p>

          <p>
            Required:{" "}
            {formatCurrency(
              budget.required_payment_before_signing ?? requiredPayment
            )}
          </p>

          <p>
            {budget.signing_payment_satisfied
              ? "Payment requirement satisfied."
              : "Payment requirement not yet satisfied."}
          </p>
        </div>
      </div>
    </div>
  );
}

export default PatientBudget;