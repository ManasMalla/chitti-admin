/* eslint-disable  @typescript-eslint/no-explicit-any */
"use client";
// pages/admin/addCheatsheet.js
import { useState } from "react";
import styles from "./AddCheatsheet.module.css"; // Import the CSS Module
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

const AddCheatsheetPage = () => {
  const [name, setName] = useState("");
  const [file, setFile] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const pathname = usePathname();


  const coursePath = pathname.split("/add-cheatsheet")[0].split("/").slice(0, 4).join("/");
  const route = pathname.split("/course/")[1].replace("/add-cheatsheet", "");

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
    setMessage("Uploading file...");

    try {
      const fileURL = await uploadFileToFirebase();
      if (!fileURL) return;

      setMessage("File uploaded. Adding cheatsheet details...");
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
        `${BASE_URL}/admin/resource/${route}/cheatsheet`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          redirect: "follow",
          body: JSON.stringify({ url: fileURL, name: file.name }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Cheatsheet Added Successfully!");
        setSuccess(true);
        setName("");
        setFile(null);
        setUploadProgress(0);
        // Redirect to the previous page
        alert("Cheatsheet Added Successfully!");
        window.location.href = coursePath;
      } else {
        setMessage(data.message || "Error adding cheatsheet.");
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
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h1>Add Cheatsheet</h1>
        <BackButton href={coursePath} />
      </div>
      {message && (
        <div
          className={`${styles["message"]} ${success ? styles["success"] : styles["error"]
            }`}
        >
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit} className={styles["add-cheatsheet-form"]}>
        <div className={styles["form-group"]}>
          <label htmlFor="file">Upload File (PDF or Image):</label>
          <input
            type="file"
            id="file"
            accept="application/pdf, image/*"
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
          Add Cheatsheet
        </button>
      </form>
    </div>
  );
};

export default AddCheatsheetPage;
