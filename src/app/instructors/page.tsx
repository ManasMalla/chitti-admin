/* eslint-disable  @typescript-eslint/no-explicit-any */
/* eslint-disable  @typescript-eslint/no-unused-vars */
// app/admin/revoke-device/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import "tailwindcss/index.css";
import { getCookie } from "cookies-next/client";
import { useRouter } from "next/navigation";
import { BASE_URL } from "@/lib/constants";

function InstructorPage() {
  const router = useRouter();
  const [rollNo, setRollNo] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<any>(null); // 'success', 'error'
  const [instructors, setInstructors] = useState<
    {
      instructorId: string;
      name: string;
      image: string;
      bio: string;
      gpa: number;
      hours: number;
    }[]
  >([]);

  useEffect(() => {
    fetch(`${BASE_URL}/admin/instructors`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("idToken")}`,
      },
    })
      .then(async (response) => {
        if (response.ok) {
          setInstructors(await response.json());
        } else {
          setMessage(
            (await response.json()).message || "Failed to fetch instructors."
          );
          setStatus("error");
        }
      })
      .catch((error) => {
        console.error("Error fetching instructors:", error);
        setMessage("Failed to fetch instructors. Please try again.");
        setStatus("error");
      });
  }, []);

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
      const response = await fetch(`${BASE_URL}/revoke-device-id`, {
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

  const handleAddInstructor = () => {
    router.push("/instructors/add-instructor");
  };

  return (
    <div className="d-flex flex-col items-start p-4 ">
      <div className="flex justify-between items-center w-full mb-10">
        <h1 className="text-2xl font-semibold">Instructors</h1>
        <button
          onClick={handleAddInstructor}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded cursor-pointer focus:outline-none focus:shadow-outline"
        >
          Add New Instructor
        </button>
      </div>

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

      <div className="flex items-center mb-4">
        {instructors?.length > 0 ? (
          <div className="flex flex-wrap gap-4">
            {instructors.map((instructor) => (
              <div
                key={instructor.instructorId}
                className="flex flex-col max-w-md border p-6 rounded-xl border-gray-500/20 mb-2"
              >
                <img
                  src={instructor.image}
                  alt={instructor.name}
                  className="size-24 rounded-full mr-2"
                />
                <h3 className="mt-4 font-semibold">{instructor.name}</h3>
                <p className="text-sm text-gray-500">
                  {instructor.instructorId}
                </p>
                <p className="text-sm text-gray-500 line-clamp-3">
                  {instructor.bio}
                </p>
                <div className="flex items-center mt-2">
                  <span className="text-sm text-gray-400 font-bold">
                    GPA: {instructor.gpa} | Hours: {instructor.hours}
                  </span>
                </div>
                <div className="flex mt-4 gap-3 items-center">
                  <button
                    onClick={() => {}}
                    className="text-white font-medium py-2 px-4 rounded border border-gray-300/10  cursor-pointer focus:outline-none focus:shadow-outline"
                  >
                    Edit Instructor
                  </button>
                  <button
                    onClick={() => {}}
                    className="text-white font-medium py-2 px-4 rounded bg-gray-300/10 hover:bg-[var(--primary)] cursor-pointer focus:outline-none focus:shadow-outline"
                  >
                    Remove Instructor
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No instructors found.</p>
        )}
      </div>
    </div>
  );
}

export default InstructorPage;
