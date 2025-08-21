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
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editInstructor, setEditInstructor] = useState<any>(null);

  const handleEditClick = (instructor: any) => {
    setEditInstructor(instructor);
    setEditModalOpen(true);
  };

  const handleEditSave = async () => {
    if (!editInstructor) return;
    try {
      const response = await fetch(`${BASE_URL}/admin/instructor/${editInstructor.instructorId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getCookie("idToken")}`,
        },
        body: JSON.stringify(editInstructor),
      });

      if (response.ok) {
        setMessage("Instructor updated successfully!");
        setStatus("success");
        // Refresh the instructors list
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
        setEditModalOpen(false);
        setEditInstructor(null);
      } else {
        setEditModalOpen(false);
        setMessage("Failed to update instructor.");
        setStatus("error");
      }
    } catch (error) {
      console.error("Error updating instructor:", error);
      setMessage("Failed to update instructor. Please try again.");
      setStatus("error");
    }
  };

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
    <div className="d-flex flex-col items-start p-4 h-screen overflow-scroll">
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
                className="flex flex-col w-[45%] border p-6 rounded-xl border-gray-400 mb-2"
              >
                <img
                  src={instructor.image}
                  alt={instructor.name}
                  className="size-24 rounded-full mr-2"
                />
                <h3 className="mt-4 font-semibold">{instructor.name}</h3>
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
                    onClick={() => handleEditClick(instructor)}
                  >
                    <span className="material-symbols-outlined cursor-pointer">
                      edit
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      fetch(`${BASE_URL}/admin/instructor/${instructor.instructorId}`, {
                        method: "DELETE",
                        headers: {
                          "Content-Type": "application/json",
                          Authorization: `Bearer ${getCookie("idToken")}`,
                        },
                      })
                        .then((response) => {
                          if (response.ok) {
                            setMessage("Instructor deleted successfully!");
                            setStatus("success");
                          } else {
                            setMessage("Failed to delete instructor.");
                            setStatus("error");
                          }
                        })
                        .catch((error) => {
                          console.error("Error deleting instructor:", error);
                          setMessage("Failed to delete instructor.");
                          setStatus("error");
                        });
                    }}
                  >
                    <span className="material-symbols-outlined cursor-pointer text-red-500/80">
                      delete
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No instructors found.</p>
        )}
      </div>
      {editModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl text-black font-semibold mb-4">Edit Instructor</h2>
            <form onSubmit={e => {
              e.preventDefault();
              handleEditSave();
            }}>
              <div className="mb-2">
                <label className="block text-sm text-black font-medium">Name</label>
                <input
                  type="text"
                  value={editInstructor?.name || ""}
                  onChange={e => setEditInstructor({ ...editInstructor, name: e.target.value })}
                  className="w-full border rounded px-2 py-1 text-black border-gray-400"
                  required
                />
              </div>
              <div className="mb-2">
                <label className="block text-sm text-black font-medium">Image URL</label>
                <input
                  type="text"
                  value={editInstructor?.image || ""}
                  onChange={e => setEditInstructor({ ...editInstructor, image: e.target.value })}
                  className="w-full border rounded px-2 py-1 text-black border-gray-400"
                  required
                />
              </div>
              <div className="mb-2">
                <label className="block text-sm text-black font-medium">Bio</label>
                <textarea
                  value={editInstructor?.bio || ""}
                  onChange={e => setEditInstructor({ ...editInstructor, bio: e.target.value })}
                  className="w-full border rounded px-2 py-1 text-black border-gray-400"
                  required
                />
              </div>
              <div className="mb-2">
                <label className="block text-sm text-black font-medium">GPA</label>
                <input
                  type="number"
                  step="0.01"
                  value={editInstructor?.gpa || ""}
                  onChange={e => setEditInstructor({ ...editInstructor, gpa: Number(e.target.value) })}
                  className="w-full border rounded px-2 py-1 text-black border-gray-400"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm text-black font-medium">Hours</label>
                <input
                  type="number"
                  value={editInstructor?.hours || ""}
                  onChange={e => setEditInstructor({ ...editInstructor, hours: Number(e.target.value) })}
                  className="w-full border rounded px-2 py-1 text-black border-gray-400"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 rounded border border-black text-black cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-600 text-white cursor-pointer"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default InstructorPage;
