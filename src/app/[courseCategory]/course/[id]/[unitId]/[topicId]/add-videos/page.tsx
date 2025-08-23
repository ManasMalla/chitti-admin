/* eslint-disable  @typescript-eslint/no-explicit-any */
/* eslint-disable  @typescript-eslint/no-unused-vars */
"use client";
// pages/admin/addVideo.js
import { useState } from "react";
import styles from "./AddVideos.module.css"; // Import the CSS Module
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

const AddVideoPage = () => {
  const [name, setName] = useState("");
  const [videoFile, setVideoFile] = useState<any>(null);
  const [thumbnailFile, setThumbnailFile] = useState<any>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const pathname = usePathname();

  const route = pathname.split("/course/")[1].replace("/add-videos", "");

  const handleFileChange = (e: any, type: "video" | "thumbnail") => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    if (type === "video" && !selectedFile.type.startsWith("video/")) {
      setMessage("Please select a valid video file.");
      setSuccess(false);
      setVideoFile(null);
      return;
    }

    if (type === "thumbnail" && !selectedFile.type.startsWith("image/")) {
      setMessage("Please select a valid image file for the thumbnail.");
      setSuccess(false);
      setThumbnailFile(null);
      return;
    }

    if (type === "thumbnail") {
      setThumbnailFile(selectedFile);
      setThumbnailPreview(URL.createObjectURL(selectedFile)); // Generate preview URL
    } else {
      setVideoFile(selectedFile);
    }
  };

  const uploadFileToFirebase = async (file: File, path: string) => {
    if (!file) return null;

    const storage = getStorage(app);
    const storageRef = ref(storage, path);
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
    setMessage("Uploading files...");

    try {
      const videoURL = await uploadFileToFirebase(
        videoFile,
        `videos/${videoFile.name}`
      );
      const thumbnailURL = await uploadFileToFirebase(
        thumbnailFile,
        `thumbnails/${thumbnailFile.name}`
      );

      if (!videoURL || !thumbnailURL) return;

      setMessage("Files uploaded. Adding video details...");
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
        `${BASE_URL}/admin/resource/${route}/video`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          redirect: "follow",
          body: JSON.stringify({
            url: videoURL,
            thumbnail: thumbnailURL,
            name,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Video Added Successfully!");
        setSuccess(true);
        setName("");
        setVideoFile(null);
        setThumbnailFile(null);
        setThumbnailPreview(null);
        setUploadProgress(0);
        alert("Video Added Successfully!");
        window.location.href = pathname.replace("/add-videos", "");
      } else {
        setMessage(data.message || "Error adding video.");
        setSuccess(false);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("An unexpected error occurred.");
      setSuccess(false);
    }
  };

  return (
    <div className={styles["add-video-container"]}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Add Video</h1>
        <BackButton href={pathname.replace("/add-videos", "")} />
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
      <form onSubmit={handleSubmit} className={styles["add-video-form"]}>
        <div className={styles["form-group"]}>
          <label htmlFor="name">Video Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className={styles["form-group"]}>
          <label htmlFor="videoFile">Upload Video:</label>
          <input
            type="file"
            id="videoFile"
            accept="video/*"
            onChange={(e) => handleFileChange(e, "video")}
            required
          />
        </div>
        <div className={styles["form-group"]}>
          <label htmlFor="thumbnailFile">Upload Thumbnail:</label>
          <input
            type="file"
            id="thumbnailFile"
            accept="image/*"
            onChange={(e) => handleFileChange(e, "thumbnail")}
            required
          />
          {thumbnailPreview && (
            <img
              src={thumbnailPreview}
              alt="Thumbnail Preview"
              className={styles["thumbnail-preview"]}
            />
          )}
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
          Add Video
        </button>
      </form>
    </div>
  );
};

export default AddVideoPage;
