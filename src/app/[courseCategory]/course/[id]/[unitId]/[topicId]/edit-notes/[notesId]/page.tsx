/* eslint-disable  @typescript-eslint/no-explicit-any */
/* eslint-disable  @typescript-eslint/no-unused-vars */
"use client";
// pages/admin/editNotes.js
import { useEffect, useState } from "react";
import styles from "./AddNotes.module.css"; // Import the CSS Module
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import app from "@/lib/firebase";
import { useParams, usePathname } from "next/navigation";
import { getCookie } from "cookies-next/client";
import { headers } from "next/headers";
import { BASE_URL } from "@/lib/constants";
import { BackButton } from "@/components/BackButton";

const EditNotesPage = () => {
  const [name, setName] = useState("");
  const [file, setFile] = useState<any>(null); // State to hold the uploaded file
  const [uploadedFileURL, setUploadedFileURL] = useState(""); // State to hold existing file URL
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const pathname = usePathname();

  const route = pathname.split("/course/")[1].split("/edit-notes")[0]; // Updated for edit-notes
  const notesId = useParams().notesId; // Get the note ID from the route

  useEffect(() => {
    const fetchNotesDetails = async () => {
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
        const response = await fetch(
          `${BASE_URL}/admin/resource/${route}/notes/${notesId}`, // Corrected API endpoint
          {
            headers: {
              Authentication: `Bearer ${token}`,
            },
            redirect: "follow",
          }
        );
        const data = await response.json();

        if (response.ok) {
          setName(data.name);
          setUploadedFileURL(data.url);
          setMessage("Note details fetched successfully.");
          setSuccess(true);
        } else {
          setMessage(data.message || "Error fetching note details.");
          setSuccess(false);
        }
      } catch (error) {
        console.error("Error:", error);
        setMessage("An unexpected error occurred.");
        setSuccess(false);
      }
    };

    fetchNotesDetails();
  }, [notesId, route]); // Dependency array includes notesId and route

  const handleFileChange = async (e: any) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) {
      return;
    }

    if (selectedFile.type !== "application/pdf") {
      setMessage("Please select a PDF file.");
      setSuccess(false);
      setFile(null); // Clear the file state
      return;
    }

    try {
      setFile(selectedFile);
    } catch (error) {
      console.error("PDF Compression Error:", error);
      setMessage("Error processing PDF. Please try a different file.");
      setSuccess(false);
      setFile(null);
      return;
    }
  };

  const uploadFileToFirebase = async () => {
    if (!file) {
      setMessage("Please select a file to upload.");
      setSuccess(false);
      return null;
    }

    const storage = getStorage(app);
    const storageRef = ref(storage, `notes/${file.name}`); // Unique file name
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
            // Delete the old file if a new file was uploaded
            if (uploadedFileURL) {
              try {
                const oldFileRef = ref(getStorage(app), uploadedFileURL);
                await deleteObject(oldFileRef);
              } catch (deleteError: any) {
                console.error("Error deleting old file:", deleteError);
                setMessage(
                  `Error deleting old file: ${deleteError.message}. The new file was uploaded successfully.`
                );
              }
            }
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
      setMessage(file ? "Uploading file..." : "Updating name...");
      const downloadURL = file ? await uploadFileToFirebase() : uploadedFileURL; // Conditional upload

      if (!downloadURL) {
        // Error message is already set in uploadFileToFirebase
        return;
      }

      setMessage("File uploaded.  Updating note details...");
      const token = getCookie("idToken");
      const currentToken = new Date().getTime() / 1000;
      if (
        token === undefined ||
        currentToken > JSON.parse(atob((token || "").split(".")[1])).exp
      ) {
        alert("Token expired.");
        window.location.href = "/";
      }
      const response = await fetch(
        `${BASE_URL}/admin/resource/${route}/notes/${notesId}`, // Corrected API endpoint
        {
          method: "PATCH", // Changed to PATCH for updating
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          redirect: "follow",
          body: JSON.stringify({ url: downloadURL, name: name }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Note Updated Successfully!");
        setSuccess(true);
        // Only reset file state if a new file was uploaded
        if (file) {
          setFile(null);
          setUploadProgress(0);
        }
        alert("Note Updated Successfully!");
        window.location.href = pathname.split("/edit-notes")[0];
      } else {
        setMessage(data.message || "Error updating note.");
        setSuccess(false);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("An unexpected error occurred.");
      setSuccess(false);
    }
  };

  return (
    <div className={styles["add-notes-container"]}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Edit Note</h1>
        <BackButton href={pathname.split("/edit-notes")[0]} />
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
      <form onSubmit={handleSubmit} className={styles["add-notes-form"]}>
        <div className={styles["form-group"]}>
          <label htmlFor="name">Note Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className={styles["form-group"]}>
          <label htmlFor="file">Upload New File:</label>
          {uploadedFileURL && (
            <p>
              Current File: <a href={uploadedFileURL}>{uploadedFileURL}</a>
            </p>
          )}
          <input
            type="file"
            id="file"
            accept="application/pdf"
            onChange={handleFileChange}
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
          Edit Note
        </button>
      </form>
    </div>
  );
};

export default EditNotesPage;
