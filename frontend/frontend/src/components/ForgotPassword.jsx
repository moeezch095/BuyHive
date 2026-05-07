import React, { useState } from "react";
import API from  "../api/api";

const ForgotPasswordModal = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleSubmit = async () => {
    if (email.trim() === "") {
      setError("This field is required");
      return;
    }
    setLoading(true);

    setError("");
    setSuccess("");

    try {
      const res = await fetch(
        API.forgotPassword,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email }),
        },
      );

      const data = await res.json();
      console.log("Forgot Password response:", data);

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }
      setSuccess(data.message || "Password reset link sent to your email!");
      setEmail("");
    } catch (err) {
      console.error("Forgot password error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="modal-overlay">
        <div className="modal-box">
          <button onClick={onClose} className="modal-close">
            ✕
          </button>

          <h2 className="modal-title">Forgot Password?</h2>

          <div className="modal-input-wrapper">
            <input
              type="email"
              placeholder="Email"
              className={`modal-input ${error ? "input-error" : ""}`}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (e.target.value.trim() !== "") {
                  setError("");
                }
              }}
            />
          </div>

          {error && <p className="modal-error">{error}</p>}

          {success && (
            <p
              style={{ color: "green", fontSize: "15px", marginBottom: "20px" }}
            >
              {success}
            </p>
          )}

          <div className="modal-button-wrapper">
            <button
              onClick={handleSubmit}
              className="modal-submit"
              disabled={loading}
            >
              {loading ? "Sending..." : "Submit"}
            </button>
          </div>

          <p className="modal-footer">
            To login your account.{"  "}
            <span onClick={onClose} className="modal-link">
              Click here!
            </span>
          </p>
        </div>
      </div>

      <style>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1200;
        }

        .modal-box {
          position: relative;
          width: 420px;
          background: #d9ecea;
          border-radius: 12px;
          padding: 39px;

          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
          animation: fadeIn 0.3s ease;
        }

        .modal-close {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: #18a0ae;
          color: white;
          border: none;
          cursor: pointer;
          transition: 0.2s ease;
        }

        .modal-close:hover {
          background: #148a96;
        }

        .modal-title {
          text-align: center;
          font-size: 28px;
          font-weight: 600;
          color: #18a0ae;
          margin-bottom: 32px;
        }

        .modal-input-wrapper {
          margin-bottom: 16px;
          padding-right: 16px
        }

        .modal-input {
          width: 100%;
          padding: 15px 9px 17px 12px;
          border-radius: 9px;
          border: 1px solid #d1d5db;
          background: #f3f4f6;
          outline: none;
          font-size: 16px;
        }

        .modal-input:focus {
          border-color: #18a0ae;
          box-shadow: 0 0 0 2px rgba(24,160,174,0.2);
        }

        .modal-error {
          color: red;
          font-size: 15px;
          margin-bottom: 20px;
        }

        .modal-button-wrapper {
          display: flex;
          justify-content: center;
          margin-bottom: 28px;
        }

        .modal-submit {
          background: #18a0ae;
          color: white;
          padding: 12px 20px 14px 17px;
          border-radius: 999px;
          border: none;
          font-size: 16px;
          cursor: pointer;
          transition: 0.2s ease;
        }

        .modal-submit:hover {
          background: #148a96;
        }

        .modal-footer {
          text-align: center;
          color: #374151;
          font-size: 16px;
        }

        .modal-link {
          color: #18a0ae;
          text-decoration: underline;
          cursor: pointer;
          font-weight: 500;
        }

        .modal-link:hover {
          color: #148a96;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </>
  );
};

export default ForgotPasswordModal;
