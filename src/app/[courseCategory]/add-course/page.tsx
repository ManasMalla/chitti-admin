/* eslint-disable  @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import styles from "./AddCourseForm.module.css";
import { usePathname } from "next/navigation";
import {getCookie} from "cookies-next/client";

function AddCourseForm() {
  const [courseId, setCourseId] = useState("");
  const courseCategory = usePathname().split("/")[1]; // Extracting courseCategory from the URL
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<any>(null); // null, 'success', 'error'

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const token = getCookie("idToken");
      const currentToken = new Date().getTime() / 1000;
      if(token === undefined || currentToken > (JSON.parse(atob((token || "").split('.')[1]))).exp){
        alert("Token expired.");
        window.location.href = "/";
      }
      const response = await fetch(
        `https://webapi-zu6v4azneq-el.a.run.app/admin/addCourse`,
        {
          method: "POST",
          redirect: "follow",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            courseId,
            courseCategory,
            title,
            description,
            image,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Course added successfully!");
        setStatus("success");
        // Reset the form
        setCourseId("");
        setTitle("");
        setDescription("");
        setImage("");
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

        <button type="submit">Add Course</button>
      </form>
    </div>
  );
}

export default AddCourseForm;
