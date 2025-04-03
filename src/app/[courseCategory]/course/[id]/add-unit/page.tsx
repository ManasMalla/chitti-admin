/* eslint-disable  @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import styles from "./AddUnitForm.module.css";
import { usePathname } from "next/navigation";

export default function Page() {
  const courseId = usePathname().split("/")[3];
  const [unitNo, setUnitNo] = useState<any>("");
  const [unitName, setUnitName] = useState<any>(undefined);
  const [description, setDescription] = useState<any>(undefined);
  const [difficulty, setDifficulty] = useState<any>(undefined);
  const [message, setMessage] = useState<any>("");
  const [status, setStatus] = useState<any>(null);
  useEffect(() => {
    console.log(window.location.hash);
    setUnitNo(parseInt(window.location.hash.replace("#", "")));
  }, []);
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const cid = courseId;

    try {
      const response = await fetch(
        `https://webapi-zu6v4azneq-el.a.run.app/admin/${cid}/addUnit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            unitNo: parseInt(unitNo), // Convert to integer
            unitName,
            description,
            difficulty,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Unit created successfully!");
        setStatus("success");

        setUnitNo("");
        setUnitName("");
        setDescription("");
        setDifficulty("");
      } else {
        setMessage(data.message || "An error occurred.");
        setStatus("error");
      }
    } catch (error) {
      console.error("Error adding unit:", error);
      setMessage("Failed to add unit. Please try again.");
      setStatus("error");
    }
  };

  return (
    <div className={styles.container}>
      <h1>Add New Unit</h1>
      {status === "success" && (
        <div className={styles.successMessage}>{message}</div>
      )}
      {status === "error" && (
        <div className={styles.errorMessage}>{message}</div>
      )}
      <form onSubmit={handleSubmit} className={styles.form}>
        <label htmlFor="unitNo">Unit Number:</label>
        <input
          type="number"
          min={1}
          readOnly
          max={5}
          id="unitNo"
          value={unitNo}
          onChange={(e) => setUnitNo(e.target.value)}
          required
        />

        <label htmlFor="unitName">Unit Name:</label>
        <input
          type="text"
          id="unitName"
          value={unitName}
          onChange={(e) => setUnitName(e.target.value)}
          required
        />

        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <label htmlFor="difficulty">Difficulty:</label>
        <select
          id="difficulty"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          required
        >
          <option value={""}>Select a difficulty</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>

        <button type="submit">Add Unit</button>
      </form>
    </div>
  );
}
