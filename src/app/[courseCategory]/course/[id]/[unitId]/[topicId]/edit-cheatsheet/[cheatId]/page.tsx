/* eslint-disable  @typescript-eslint/no-explicit-any */
"use client";
// pages/admin/addCheatsheet.js
import { useEffect, useState } from "react";
import styles from "./AddCheatsheet.module.css"; // Import the CSS Module
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import app from "@/lib/firebase";
import { useParams, usePathname } from "next/navigation";
import {getCookie} from "cookies-next/client";

const AddCheatsheetPage = () => {
  const [name, setName] = useState("");
  const [file, setFile] = useState<any>(null);
  const [uploadedFileURL, setUploadedFileURL] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const pathname = usePathname();

  const route = pathname.split("/course/")[1].split("/edit-cheatsheet")[0];
  const cheatId = useParams().cheatId;

  useEffect(() => {
    // fetch the cheatsheet details from the API
    const fetchCheatsheetDetails = async () => {
      try {
        const token = getCookie("idToken");
        const currentToken = new Date().getTime() / 1000;
        if (token === undefined || currentToken > (JSON.parse(atob((token || "").split('.')[1]))).exp) {
          alert("Token expired.");
          window.location.href = "/";
        }
        const response = await fetch(
          `https://webapi-zu6v4azneq-el.a.run.app/admin/course/${route}/get-cheatsheet/${cheatId}`,
            {
              headers: {
                "Authorization": `Bearer ${token}`
              },
              redirect: "follow"
            }
        );
        const data = await response.json();

        if (response.ok) {
          setName(data.name);
          setUploadedFileURL(data.url);
          setMessage("Cheatsheet details fetched successfully.");
          setSuccess(true);
        } else {
          setMessage(data.message || "Error fetching cheatsheet details.");
          setSuccess(false);
        }
      } catch (error) {
        console.error("Error:", error);
        setMessage("An unexpected error occurred.");
        setSuccess(false);
      }
    };
    fetchCheatsheetDetails();
  }, []);

  const handleFileChange = (e: any) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    if (
      !selectedFile.type.startsWith("application/pdf") &&
      !selectedFile.type.startsWith("image/")
    ) {
      setMessage("Please select a valid PDF or image file.");
      setSuccess(false);
      setFile(null);
      return;
    }

    setFile(selectedFile);
  };

  const uploadFileToFirebase = async () => {
    if (!file) return null;

    const storage = getStorage(app);
    const storageRef = ref(storage, `cheatsheets/${file.name}`);
    const oldStorageRef = ref(storage, uploadedFileURL);

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
            await deleteObject(oldStorageRef);
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
    setMessage(!file ? "Loading.." : "Uploading file...");

    try {
      const fileURL = !file ? uploadedFileURL : await uploadFileToFirebase();

      if (!fileURL) return;

      setMessage(
        !file
          ? "Updating cheatsheet details..."
          : "File uploaded. Adding cheatsheet details..."
      );

      const token = getCookie("idToken");
      const currentToken = new Date().getTime() / 1000;
      if (token === undefined || currentToken > (JSON.parse(atob((token || "").split('.')[1]))).exp) {
        alert("Token expired.");
        window.location.href = "/";
      }

      const response = await fetch(
        `https://webapi-zu6v4azneq-el.a.run.app/admin/course/${route}/edit-cheatsheet/${cheatId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
          redirect: "follow",
          body: JSON.stringify({ url: fileURL, name }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Cheatsheet Updated Successfully!");
        setSuccess(true);
        setName("");
        setFile(null);
        setUploadProgress(0);
        // Redirect to the previous page
        alert("Cheatsheet Updated Successfully!");
        window.location.href = pathname.split("/edit-cheatsheet")[0];
      } else {
        setMessage(data.message || "Error updating cheatsheet.");
        setSuccess(false);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("An unexpected error occurred.");
      setSuccess(false);
    }
  };

  return (
    <div className={styles["add-cheatsheet-container"]}>
      <h1>Edit Cheatsheet</h1>
      {message && (
        <div
          className={`${styles["message"]} ${
            success ? styles["success"] : styles["error"]
          }`}
        >
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit} className={styles["add-cheatsheet-form"]}>
        <div className={styles["form-group"]}>
          <label htmlFor="name">Cheatsheet Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className={styles["form-group"]}>
          <label htmlFor="file">Re-Upload File (PDF or Image):</label>
          <p>
            Current resource: <a href={uploadedFileURL}>{uploadedFileURL}</a>
          </p>
          <input
            type="file"
            id="file"
            accept="application/pdf, image/*"
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
          Edit Cheatsheet
        </button>
      </form>
    </div>
  );
};

export default AddCheatsheetPage;
