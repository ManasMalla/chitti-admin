/* eslint-disable  @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
import styles from "./AddCourseForm.module.css";
import { usePathname } from "next/navigation";
import { getCookie } from "cookies-next/client";
import { BASE_URL } from "@/lib/constants";

interface Instructor {
  _id: string;
  name: string;
  bio: string;
  image: string;
  gpa: number;
  hours: number;
}

function AddCourseForm() {
  const [courseId, setCourseId] = useState("");
  const courseCategory = usePathname().split("/")[1]; // Extracting courseCategory from the URL
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [instructorId, setInstructorId] = useState("");
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loadingInstructors, setLoadingInstructors] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<any>(null); // null, 'success', 'error'

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
        setInstructorId("");
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

        <label htmlFor="instructor">Instructor:</label>
        <select
          id="instructor"
          value={instructorId}
          onChange={(e) => setInstructorId(e.target.value)}
          required
          disabled={loadingInstructors}
        >
          <option value="">
            {loadingInstructors
              ? "Loading instructors..."
              : "Select an instructor"}
          </option>
          {instructors.map((instructor) => (
            <option key={instructor._id} value={instructor._id}>
              {instructor.name} (GPA: {instructor.gpa}, Hours:{" "}
              {instructor.hours})
            </option>
          ))}
        </select>

        <button type="submit" disabled={loadingInstructors}>
          Add Course
        </button>
      </form>
    </div>
  );
}

export default AddCourseForm;
