/* eslint-disable  @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect, useRef } from "react";
import styles from "./AddCourseForm.module.css";
import { usePathname, useRouter } from "next/navigation";
import { getCookie } from "cookies-next/client";
import { BASE_URL } from "@/lib/constants";

interface Instructor {
  instructorId: string;
  name: string;
  bio: string;
  image: string;
  gpa: number;
  hours: number;
}

function AddCourseForm() {
  const [courseId, setCourseId] = useState("");
  const courseCategory = usePathname().split("/")[1]; // Extracting courseCategory from the URL
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [instructorId, setInstructorId] = useState<string[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loadingInstructors, setLoadingInstructors] = useState(false);
  const [showInstructorDropdown, setShowInstructorDropdown] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<any>(null); // null, 'success', 'error'
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedInstructors = instructors.filter((inst: Instructor) =>
    instructorId.includes(inst.instructorId)
  );

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

  // Fetch instructors on component mount
  useEffect(() => {
    const fetchInstructors = async () => {
      setLoadingInstructors(true);
      try {
        const token = getCookie("idToken");
        const currentToken = new Date().getTime() / 1000;

        if (
          token === undefined ||
          currentToken > JSON.parse(atob((token || "").split(".")[1])).exp
        ) {
          alert("Token expired.");
          window.location.href = "/";
          return;
        }

        const response = await fetch(`${BASE_URL}/admin/instructors`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setInstructors(data || []);

          console.log("Response status:", response.status);
          console.log("Instructors data:", data);
        } else {
          console.error("Failed to fetch instructors");
          setMessage("Failed to load instructors");
          setStatus("error");
        }
      } catch (error) {
        console.error("Error fetching instructors:", error);
        setMessage("Failed to load instructors");
        setStatus("error");
      } finally {
        setLoadingInstructors(false);
      }
    };

    fetchInstructors();
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

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
      const response = await fetch(`${BASE_URL}/admin/course`, {
        method: "POST",
        redirect: "follow",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          courseId,
          courseCategory,
          title,
          description,
          image,
          instructorId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Course added successfully!");
        setStatus("success");
        // Reset the form
        setCourseId("");
        setTitle("");
        setDescription("");
        setImage("");
        setInstructorId([]);
        
        // Navigate back to the course category page after a short delay
        setTimeout(() => {
          router.push(`/${courseCategory}`);
        }, 1500);
      } else {
        setMessage(data.message || "An error occurred.");
        setStatus("error");
      }
    } catch (error) {
      console.error("Error adding course:", error);
      setMessage("Failed to add course. Please try again.");
      setStatus("error");
    }
  };

  return (
    <div className={styles.container}>
      <h1>Add New Course</h1>
      {status === "success" && (
        <div className={styles.successMessage}>{message}</div>
      )}
      {status === "error" && (
        <div className={styles.errorMessage}>{message}</div>
      )}
      <form onSubmit={handleSubmit} className={styles.form}>
        <label htmlFor="courseId">Course ID:</label>
        <input
          type="text"
          id="courseId"
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
          required
        />

        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <label htmlFor="image">Image URL:</label>
        <input
          type="url"
          id="image"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          required
        />

        <label htmlFor="instructor">Instructors:</label>
        <div className={styles.selectedTags}>
          {selectedInstructors.length > 0 ? (
            selectedInstructors.map((inst) => (
              <span
                key={inst.instructorId}
                className={styles.selectedTag}
              >
                {inst.name}
              </span>
            ))
          ) : (
            <span className={styles.noSelection}>No instructors selected</span>
          )}
        </div>
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            className={styles.dropdownButton}
            onClick={() => setShowInstructorDropdown((prev) => !prev)}
            disabled={loadingInstructors}
          >
            {loadingInstructors
              ? "Loading instructors..."
              : "Select Instructors"}
            <span className="material-symbols-outlined">
              arrow_drop_down
            </span>
          </button>
          {showInstructorDropdown && (
            <div className={styles.dropdownMenu}>
              {instructors.map((instructor) => (
                <label
                  key={instructor.instructorId}
                  className={styles.dropdownItem}
                >
                  <input
                    type="checkbox"
                    checked={instructorId.includes(instructor.instructorId)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setInstructorId([...instructorId, instructor.instructorId]);
                      } else {
                        setInstructorId(instructorId.filter((id) => id !== instructor.instructorId));
                      }
                    }}
                  />
                  {instructor.name} (GPA: {instructor.gpa}, Hours: {instructor.hours})
                </label>
              ))}
            </div>
          )}
        </div>

        <button type="submit" disabled={loadingInstructors}>
          Add Course
        </button>
      </form>
    </div>
  );
}

export default AddCourseForm;
