import "../styles/login.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login({ closeModal, setIsLoggedin }) {
  const API_URL = import.meta.env.VITE_API_URL;
  const [showPassword, setShowPassword] = useState(true);
  const [user_name, setUser_name] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();

    const response = await fetch(`${API_URL}/verify_login`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_name,
        password,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      setIsLoggedin(true);
      closeModal(false);
      navigate("/admin");
    } else {
      setMessage(data.message);
    }
  }

  return (
    <>
      <div className="login-background">
        <div className="login-card">
          <div className="swiss-logo-section">
            <img
              src="/Images/SwissLogo.png"
              alt="swisslogo"
              className="login-swiss-logo"
            />
          </div>
          <div className="login-header-section">
            <div className="login-header">
              <h1>Log In</h1>
            </div>
            <div className="login-header-p">
              <p>
                This login page is only for swiss dental clinic admins, if you
                want to make an appointment just proceed to appointment booking
                section.
              </p>
            </div>
          </div>

          <form onSubmit={handleLogin}>
            <div className="login-input-section">
              <div className="input-section">
                <label htmlFor="login-user" className="login-labels">
                  Username
                </label>
                <input
                  type="text"
                  name="login-user"
                  className="login-input"
                  placeholder="Enter your username"
                  value={user_name}
                  onChange={(e) => setUser_name(e.target.value)}
                />
                <img
                  src="/Images/user.png"
                  alt="user-icon"
                  className="input-icon"
                />
              </div>
              <div className="input-section">
                <label htmlFor="" className="login-labels">
                  Password
                </label>
                <input
                  type={showPassword ? "password" : "text"}
                  name="login-password"
                  className="login-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <img
                  src="/Images/padlock.png"
                  alt="user-icon"
                  className="input-icon"
                />
                <img
                  src={showPassword ? "/Images/view.png" : "/Images/hide.png"}
                  onClick={() => setShowPassword(!showPassword)}
                  alt="showpassword-icon"
                  className="showpass-icon"
                />
              </div>
              <div className="login-message">
                <p>{message}</p>
              </div>
              <div className="login-buttons">
                <div>
                  <button type="submit" className="modal-login-button">
                    Login
                  </button>
                </div>
                <div>
                  <button
                    type="button"
                    className="close-login-button"
                    onClick={() => closeModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
