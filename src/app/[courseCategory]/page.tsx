/* eslint-disable  @typescript-eslint/no-explicit-any */
"use client";
import { useParams } from "next/navigation";
// import Image from "next/image";
// import styles from "./page.module.css";
// import Link from "next/link";

import { useEffect, useState, useRef } from "react";
import { getCookie } from "cookies-next/client";
import { BASE_URL } from "@/lib/constants";

export default function Home() {
  const { courseCategory } = useParams();
  const [courses, setCourses] = useState<any>([]);
  const [instructors, setInstructors] = useState<any>([]);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<any>(null); // 'success', 'error'
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editCourse, setEditCourse] = useState<any>(null);
  const [showInstructorDropdown, setShowInstructorDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedInstructors = instructors.filter((inst: any) =>
    (editCourse?.instructorId || []).includes(inst.instructorId)
  );

  function editCourseForm(course: any) {
    console.log(course);
    setEditCourse(course);
    setEditModalOpen(true);
  }

  const handleEditSave = async () => {
    if (!editCourse) return;
    try {
      const response = await fetch(`${BASE_URL}/admin/course/${editCourse.courseId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getCookie("idToken")}`,
        },
        body: JSON.stringify(editCourse),
      });

      if (response.ok) {
        setMessage("Course updated successfully!");
        setStatus("success");
        fetch(`${BASE_URL}/admin/courses/${courseCategory}`, {
          headers: {
            Authorization: `Bearer ${getCookie("idToken")}`,
          },
          redirect: "follow",
        })
          .then(async (response) => {
            if (response.ok) {
              setCourses(await response.json());
            } else {
              setMessage(
                (await response.json()).message || "Failed to fetch courses."
              );
              setStatus("error");
            }
          })
          .catch((error) => {
            console.error("Error fetching courses:", error);
            setMessage("Failed to fetch courses. Please try again.");
            setStatus("error");
          });
        setEditModalOpen(false);
        setEditCourse(null);
      } else {
        setEditModalOpen(false);
        setMessage("Failed to update course.");
        setStatus("error");
      }
    } catch (error) {
      console.error("Error updating course:", error);
      setMessage("Failed to update course. Please try again.");
      setStatus("error");
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const token = getCookie("idToken");
    const currentToken = new Date().getTime() / 1000;
    if (
      token === undefined ||
      currentToken > JSON.parse(atob((token || "").split(".")[1])).exp
    ) {
      alert("Token expired.");
      window.location.href = "/";
    }
    fetch(`${BASE_URL}/admin/courses/${courseCategory}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      redirect: "follow",
    })
      .then((response) => response.json())
      .then((data) => {
        setCourses(data);
        console.log(data);
      })
      .catch((error) => console.error("Error fetching data:", error));
    fetch(`${BASE_URL}/admin/instructors`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      redirect: "follow",
    })
      .then((response) => response.json())
      .then((data) => {
        setInstructors(data);
        console.log(data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, [courseCategory]);

  // Handle clicking outside dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowInstructorDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // function addResource() {

  return (
    <div className="content">
      <div className="course-head">
        <div>
          <h4>
            {courseCategory?.toString()?.split("-").join(" ").toUpperCase()}
          </h4>
          <h3>Courses</h3>
        </div>
        <a
          href={"/" + courseCategory + "/add-course"}
         className="decoration-none flex items-center gap-2"
        >
          <span className="material-symbols-outlined">
            add
          </span>
          Add Courses
        </a>
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
      <div className="courses">
        {courses.map((r: any) => (
          <div
            key={r.courseId}
            className="flex flex-col gap-4 border border-gray-700 dark:border-gray-400 rounded-b-lg text-start"
          >
            <a
              className="decoration-none cursor-pointer"
              href={"/" + courseCategory + "/course/" + r.courseId}
            >
              <div className="view-course h-full aspect-[1.4]">
                <img src={r.image} alt={r.title} />
                <h3>
                  {r.title
                    .split(" ")
                    .map(
                      (e: string) =>
                        e[0].toUpperCase() + e.substring(1).toLowerCase()
                    )
                    .join(" ")}
                </h3>
                <p>{r.description}</p>
              </div>
            </a>
            <div className="flex items-center justify-evenly p-2">
              <button
                onClick={() => {
                  editCourseForm({ ...r, newCourseId: r.courseId });
                }}
              >
                <span className="material-symbols-outlined cursor-pointer">
                  edit
                </span>
              </button>
              <button
                onClick={() => {
                  fetch(`${BASE_URL}/admin/course/${r.courseId}`, {
                    method: "DELETE",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${getCookie("idToken")}`,
                    },
                  }).then((response) => {
                    if (response.ok) {
                      setMessage("Course deleted successfully!");
                      setStatus("success");
                    } else {
                      setMessage("Failed to delete course.");
                      setStatus("error");
                    }
                  })
                    .catch((error) => {
                      console.error("Error deleting course:", error);
                      setMessage("Failed to delete course.");
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
      {editModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl text-black font-semibold mb-4">Edit Course</h2>
            <form
              className="text-start"
              onSubmit={e => {
                e.preventDefault();
                handleEditSave();
              }}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-black">
                  Course ID
                </label>
                <input
                  type="text"
                  value={editCourse?.newCourseId || ""}
                  onChange={e => setEditCourse({ ...editCourse, newCourseId: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-black"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-black">
                  Course Category
                </label>
                <select
                  value={editCourse?.courseCategory || ""}
                  onChange={e => setEditCourse({ ...editCourse, courseCategory: e.target.value })}
                  className="w-full border border-gray-300 rounded-md p-2 text-black cursor-pointer"
                >
                  <option value="">Select a category</option>
                  <option value="university-core">University Core</option>
                  <option value="faculty-core">Faculty Core</option>
                  <option value="program-core">Program Core</option>
                  <option value="program-elective">Program Elective</option>
                  <option value="open-elective">Open Elective</option>
                  <option value="management-basket">Management Basket</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-black">
                  Course Title
                </label>
                <input
                  type="text"
                  value={editCourse?.title || ""}
                  onChange={e => setEditCourse({ ...editCourse, title: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-black"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-black">
                  Course Description
                </label>
                <textarea
                  value={editCourse?.description || ""}
                  onChange={e => setEditCourse({ ...editCourse, description: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-black"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-black">
                  Course Image URL
                </label>
                <input
                  type="text"
                  value={editCourse?.image || ""}
                  onChange={e => setEditCourse({ ...editCourse, image: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-black"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-black">
                  Instructors
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {selectedInstructors.length > 0 ? (
                    selectedInstructors.map((inst: any) => (
                      <span
                        key={inst.instructorId}
                        className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
                      >
                        {inst.name}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-400 text-xs">No instructors selected</span>
                  )}
                </div>
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    className="flex items-center justify-between w-full border border-gray-300 rounded-md p-2 text-black text-left bg-white cursor-pointer"
                    onClick={() => setShowInstructorDropdown((prev) => !prev)}
                  >
                    Select Instructors
                    <span className="material-symbols-outlined">
                      arrow_drop_down
                    </span>
                  </button>
                  {showInstructorDropdown && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md mt-1 w-full max-h-48 overflow-auto shadow-lg">
                      {instructors.map((instructor: any) => (
                        <label
                          key={instructor.instructorId}
                          className="flex items-center px-2 py-1 cursor-pointer hover:bg-gray-100 text-black"
                        >
                          <input
                            type="checkbox"
                            checked={(editCourse?.instructorId || []).includes(instructor.instructorId)}
                            onChange={e => {
                              const selected = editCourse?.instructorId || [];
                              if (e.target.checked) {
                                setEditCourse({
                                  ...editCourse,
                                  instructorId: [...selected, instructor.instructorId],
                                });
                              } else {
                                setEditCourse({
                                  ...editCourse,
                                  instructorId: selected.filter((id: string) => id !== instructor.instructorId),
                                });
                              }
                            }}
                            className="mr-2"
                          />
                          {instructor.name}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
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
