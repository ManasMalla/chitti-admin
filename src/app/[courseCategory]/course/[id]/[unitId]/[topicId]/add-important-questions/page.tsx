/* eslint-disable  @typescript-eslint/no-explicit-any */
"use client";
// pages/admin/addIq.js
import { useState } from "react";
import styles from "./AddIq.module.css"; // Import the CSS Module
import { usePathname } from "next/navigation";

const AddIqPage = () => {
  const pathname = usePathname();
  const route = pathname
    .split("/course/")[1]
    .replace("/add-important-questions", "");
  const [tag, setTag] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `https://webapi-zu6v4azneq-el.a.run.app/admin/${route}/addIq`,
        {
          // Ensure the API route is correct for your Next.js setup
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ tag, question, answer }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Important Question Added Successfully!");
        setSuccess(true);
        // Clear the form
        setTag("");
        setQuestion("");
        setAnswer("");
      } else {
        setMessage(data.message || "Error adding important question.");
        setSuccess(false);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("An unexpected error occurred.");
      setSuccess(false);
    }
  };

  return (
    <div className={styles["add-iq-container"]}>
      <h1>Add Important Question</h1>
      {message && (
        <div
          className={`${styles["message"]} ${
            success ? styles["success"] : styles["error"]
          }`}
        >
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit} className={styles["add-iq-form"]}>
        <div className={styles["form-group"]}>
          <label htmlFor="tag">Tag:</label>
          <input
            type="text"
            id="tag"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            required
          />
        </div>
        <div className={styles["form-group"]}>
          <label htmlFor="question">Question:</label>
          <textarea
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
          />
        </div>
        <div className={styles["form-group"]}>
          <label htmlFor="answer">Answer:</label>
          <textarea
            id="answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            required
          />
        </div>
        <button type="submit" className={styles["submit-button"]}>
          Add Question
        </button>
      </form>
    </div>
  );
};

export default AddIqPage;
