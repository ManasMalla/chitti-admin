/* eslint-disable  @typescript-eslint/no-explicit-any */
/* eslint-disable  @typescript-eslint/no-unused-vars */
"use client";
// pages/admin/addIq.js
import { use, useState } from "react";
import styles from "./AddIq.module.css"; // Import the CSS Module (create this)
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import app from "@/lib/firebase";
import { usePathname } from "next/navigation";
import { getCookie } from "cookies-next/client";
import { BASE_URL } from "@/lib/constants";
import { BackButton } from "@/components/BackButton";

const AddIqPage = () => {
  const [file, setFile] = useState<any>(null); // State to hold the uploaded file
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const pathname = usePathname();
  const route = pathname
    .split("/course/")[1]
    .replace("/add-important-questions", "");

  const handleFileChange = async (e: any) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) {
      return;
    }

    // Validate File Type (e.g., image, PDF, etc.) - Adjust as needed
    const allowedTypes = ["application/pdf"]; // Example: JPEG, PNG, PDF
    if (!allowedTypes.includes(selectedFile.type)) {
      setMessage("Please select a valid file type (PDF)."); // Adjust message
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
    const storageRef = ref(storage, `iqs/${file.name}`); // More specific path
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
      const token = getCookie("idToken");
      const currentToken = new Date().getTime() / 1000;
      if (
        token === undefined ||
        currentToken > JSON.parse(atob((token || "").split(".")[1])).exp
      ) {
        alert("Token expired.");
        window.location.href = "/";
      }
      const response = await fetch(`${BASE_URL}/admin/resource/${route}/iq`, {
        method: "POST",
        redirect: "follow",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ url: downloadURL }), // Just the URL
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Important Question Added Successfully!");
        setSuccess(true);
        setFile(null);
        setUploadProgress(0);
        alert("Important Question Added Successfully!");
        window.location.href = pathname.replace(
          `${route.split("/")[1]}/add-important-questions`,
          ""
        );
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Add Important Question</h1>
        <BackButton href={pathname.replace("/add-important-questions", "")} />
      </div>
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
            accept="application/pdf" // Adjust accepted types
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
