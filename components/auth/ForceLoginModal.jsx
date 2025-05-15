import React from "react";
import "@/styles/LoginModal.css";

export default function ForceLoginModal({
  activeSessions,
  onClose,
  onForceLogin,
}) {
  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Active Sessions</h2>
        <p>There are active sessions on this account.</p>
        <ul>
          {activeSessions.map((session, index) => (
            <li key={index}>
              <strong>Session ID:</strong> {session.sessionId} <br />
              <strong>IP Address:</strong> {session.ip} <br />
              <strong>User Agent:</strong> {session.userAgent} <br />
              <strong>Login Time:</strong>{" "}
              {new Date(session.loginTime).toLocaleString()} <br />
              <strong>Last Activity:</strong>{" "}
              {new Date(session.lastActivity).toLocaleString()}
            </li>
          ))}
        </ul>
        <div className="btn-group">
          <button className="btn btn-danger" onClick={() => onForceLogin(true)}>
            Force Login and Terminate Other Sessions
          </button>
          <button
            className="btn btn-warning"
            onClick={() => onForceLogin(false)}
          >
            Force Login Without Terminating Sessions
          </button>
        </div>
        <button className="btn btn-secondary" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
