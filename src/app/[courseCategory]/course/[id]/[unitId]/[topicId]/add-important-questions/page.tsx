/* eslint-disable  @typescript-eslint/no-explicit-any */
/* eslint-disable  @typescript-eslint/no-unused-vars */
"use client";
// pages/admin/addIq.js
import { useState } from "react";
import styles from "./AddIq.module.css"; // Import the CSS Module (create this)
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import app from "@/lib/firebase";
import { useParams, useRouter } from "next/navigation";

const AddIqPage = () => {
  const [file, setFile] = useState<any>(null); // State to hold the uploaded file
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { cid, uid } = useParams();
  const router = useRouter();

  const handleFileChange = async (e: any) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) {
      return;
    }

    // Validate File Type (e.g., image, PDF, etc.) - Adjust as needed
    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"]; // Example: JPEG, PNG, PDF
    if (!allowedTypes.includes(selectedFile.type)) {
      setMessage("Please select a valid file type (JPEG, PNG, PDF)."); // Adjust message
      setSuccess(false);
      setFile(null); // Clear the file state
      return;
    }

    console.log("Selected file:", selectedFile);

    setFile(selectedFile);
  };

  const uploadFileToFirebase = async () => {
    if (!file) {
      setMessage("Please select a file to upload.");
      setSuccess(false);
      return null;
    }

    const storage = getStorage(app); // Pass the Firebase app instance
    const storageRef = ref(storage, `iqs/${cid}/${uid}/${file.name}`); // More specific path
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot: any) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error: any) => {
          console.error("Firebase Upload Error:", error);
          setMessage(`Firebase Upload Error: ${error.message}`);
          setSuccess(false);
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          } catch (error: any) {
            console.error("Download URL Error:", error);
            setMessage(`Download URL Error: ${error.message}`);
            setSuccess(false);
            reject(error);
          }
        }
      );
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      setMessage("Uploading file...");
      const downloadURL = await uploadFileToFirebase();

      if (!downloadURL) {
        // Error message is already set in uploadFileToFirebase
        return;
      }

      setMessage("File uploaded. Adding IQ details...");

      const response = await fetch(
        `https://webapi-zu6v4azneq-el.a.run.app/admin/${cid}/${uid}/addIq`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url: downloadURL }), // Just the URL
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Important Question Added Successfully!");
        setSuccess(true);
        setFile(null);
        setUploadProgress(0);
        alert("Important Question Added Successfully!");
        router.push(`/admin/course/${cid}/unit/${uid}`); // Adjust the redirect
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
          <label htmlFor="file">Upload File:</label>
          <input
            type="file"
            id="file"
            accept="image/*, application/pdf" // Adjust accepted types
            onChange={handleFileChange}
            required
          />
        </div>
        {uploadProgress > 0 && (
          <div className={styles["upload-progress"]}>
            Upload Progress: {uploadProgress.toFixed(2)}%
          </div>
        )}
        <button
          type="submit"
          className={styles["submit-button"]}
          disabled={uploadProgress > 0 && uploadProgress < 100}
        >
          Add Important Question
        </button>
      </form>
    </div>
  );
};

export default AddIqPage;
