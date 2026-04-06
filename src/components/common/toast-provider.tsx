"use client";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function CloseButton({ closeToast }: { closeToast?: () => void }) {
  return (
    <button
      onClick={closeToast}
      style={{
        position: "absolute",
        top: 6,
        right: 8,
        background: "none",
        border: "none",
        color: "#94a3b8",
        cursor: "pointer",
        fontSize: 18,
        lineHeight: 1,
      }}
    >
      &times;
    </button>
  );
}

export function ToastProvider() {
  return (
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      limit={1}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
      closeButton={CloseButton}
      toastStyle={{
        background: "rgba(20, 24, 50, 0.95)",
        border: "1px solid rgba(148, 163, 184, 0.15)",
        color: "#F8FAFC",
        backdropFilter: "blur(8px)",
        borderRadius: 12,
        paddingRight: 30,
      }}
    />
  );
}
