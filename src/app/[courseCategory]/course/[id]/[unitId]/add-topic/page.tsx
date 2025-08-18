/* eslint-disable  @typescript-eslint/no-explicit-any */
"use client";
import { usePathname } from "next/navigation";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import { getCookie } from "cookies-next/client";

export default function Page() {
  const params = usePathname();
  const [topicNamePrefix, setTopicNamePrefix] = useState("");
  useEffect(() => {
    setTopicNamePrefix(window.location.hash.replace("#", ""));
  });
  const [topicName, setTopicName] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const courseId = params.replace("/add-topic", "").split("/")[
      params.split("/").length - 3
    ];

    const unitId = params.replace("/add-topic", "").split("/").pop();
    const token = getCookie("idToken");
    const currentToken = new Date().getTime() / 1000;
    if (
      token === undefined ||
      currentToken > JSON.parse(atob((token || "").split(".")[1])).exp
    ) {
      alert("Token expired.");
      window.location.href = "/";
    }
    try {
      const response = await fetch(
        `https://webapi-zu6v4azneq-el.a.run.app/admin/course/${courseId}/${unitId}/addTopic`,
        {
          //IMPORTANT:  Use /api route
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          redirect: "follow",
          body: JSON.stringify({
            name: `${topicNamePrefix} ${topicName}`,
            difficulty: difficulty,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessageType("error");
        setMessage(data.message || "An error occurred.");
      } else {
        setMessageType("success");
        setMessage("Topic added successfully!");
        setTopicName("");
        setDifficulty(""); // Clear the form
      }
    } catch (error) {
      setMessageType("error");
      setMessage("An error occurred: " + error);
    }
  };

  return (
    <div className={styles["container"]}>
      <h4>
        {params
          .replace("/add-topic", "")
          .split("/")
          .pop()
          ?.split("-")
          .join(" ")
          .toUpperCase()}
      </h4>
      <h2>Add Topic</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label htmlFor="topicName">Topic Name:</label>
        <input
          type="text"
          id="topicName"
          name="topicName"
          value={topicName}
          onChange={(e) => setTopicName(e.target.value)}
          required
        />

        <label htmlFor="difficulty">Difficulty:</label>
        <select
          id="difficulty"
          name="difficulty"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          required
        >
          <option value="">Select Difficulty</option>
          <option value="no-difficulty">N/A</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>

        <button type="submit">Add Topic</button>
      </form>

      {message && (
        <div
          className={`${styles.message} ${
            messageType === "success" ? styles.success : styles.error
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
}
