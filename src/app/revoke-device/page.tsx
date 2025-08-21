/* eslint-disable  @typescript-eslint/no-explicit-any */
/* eslint-disable  @typescript-eslint/no-unused-vars */
// app/admin/revoke-device/page.tsx
"use client";
import React, { useState } from "react";
import "tailwindcss/index.css";
import { getCookie } from "cookies-next/client";
import { BASE_URL } from "@/lib/constants";

function RevokeDevicePage() {
  const [rollNo, setRollNo] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<any>(null); // 'success', 'error'

  const handleRevokeDevice = async () => {
    try {
      const token = getCookie("idToken");
      const currentToken = new Date().getTime() / 1000;
      if (
        token === undefined ||
        currentToken > JSON.parse(atob((token || "").split(".")[1])).exp
      ) {
        alert("Token expired.");
        window.location.href = "/";
      }
      const response = await fetch(`${BASE_URL}/auth/revoke-device-id`, {
        // Adjust the endpoint if needed
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rollNo: rollNo }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || "Device revoked successfully!");
        setStatus("success");
      } else {
        setMessage(data.message || "Failed to revoke device.");
        setStatus("error");
      }
    } catch (error) {
      console.error("Error revoking device:", error);
      setMessage("Failed to revoke device. Please try again.");
      setStatus("error");
    }
  };

  return (
    <div className="d-flex flex-col items-start p-4 ">
      <h1 className="text-2xl font-semibold mb-10">Revoke Device</h1>

      {status === "success" && (
        <div className="bg-green-100 text-green-700 border border-green-400 px-4 py-2 rounded-md mb-4">
          {message}
        </div>
      )}

      {status === "error" && (
        <div className="h-[80px] bg-red-100 text-red-700 border border-red-400 px-4 py-2 rounded-md mb-4">
          {message}
        </div>
      )}

      <div className="flex text-nowrap items-center mb-4">
        <label htmlFor="rollNo" className="mr-3 font-medium">
          Roll No:
        </label>
        <input
          type="text"
          id="rollNo"
          className="mr-3 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={rollNo}
          onChange={(e) => setRollNo(e.target.value)}
        />
        <button
          onClick={handleRevokeDevice}
          className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-2 cursor-pointer"
        >
          Revoke
        </button>
      </div>
    </div>
  );
}

export default RevokeDevicePage;
