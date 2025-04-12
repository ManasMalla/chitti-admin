/* eslint-disable  @typescript-eslint/no-explicit-any */
/* eslint-disable  @typescript-eslint/no-unused-vars */
"use client";
// pages/admin/editVideo.js
import { useEffect, useState } from "react";
import styles from "./AddVideos.module.css"; // Import the CSS Module
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

const EditVideoPage = () => {
  const [name, setName] = useState("");
  const [videoFile, setVideoFile] = useState<any>(null);
  const [thumbnailFile, setThumbnailFile] = useState<any>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  const [uploadedVideoURL, setUploadedVideoURL] = useState("");
  const [uploadedThumbnailURL, setUploadedThumbnailURL] = useState("");

  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const pathname = usePathname();

  const route = pathname.split("/course/")[1].split("/edit-video")[0];
  const videoId = useParams().videoId;

  useEffect(() => {
    const fetchVideoDetails = async () => {
      try {
        const token = getCookie("idToken");
        const currentToken = new Date().getTime() / 1000;
        if (token === undefined || currentToken > (JSON.parse(atob((token || "").split('.')[1]))).exp) {
          alert("Token expired.");
          window.location.href = "/";
        }
        const response = await fetch(
          `https://webapi-zu6v4azneq-el.a.run.app/admin/course/${route}/get-video/${videoId}`,
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
          setUploadedVideoURL(data.url);
          setUploadedThumbnailURL(data.thumbnail);
          setThumbnailPreview(data.thumbnail); // Set thumbnail preview for existing thumbnail
          setMessage("Video details fetched successfully.");
          setSuccess(true);
        } else {
          setMessage(data.message || "Error fetching video details.");
          setSuccess(false);
        }
      } catch (error) {
        console.error("Error:", error);
        setMessage("An unexpected error occurred.");
        setSuccess(false);
      }
    };

    fetchVideoDetails();
  }, [videoId, route]);

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

  const uploadFileToFirebase = async (
    file: File,
    path: string,
    oldURL: string | null = null
  ) => {
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

            // Delete old file if it exists
            if (oldURL) {
              try {
                const oldFileRef = ref(getStorage(app), oldURL);
                await deleteObject(oldFileRef);
              } catch (deleteError: any) {
                console.error("Error deleting old file:", deleteError);
                setMessage(
                  `Error deleting old file: ${deleteError.message}. The new file was uploaded successfully.`
                );
                // Consider if you want to reject here, or continue anyway
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
    setMessage("Uploading files...");

    try {
      const videoURL = videoFile
        ? await uploadFileToFirebase(
            videoFile,
            `videos/${videoFile.name}`,
            uploadedVideoURL
          )
        : uploadedVideoURL;

      const thumbnailURL = thumbnailFile
        ? await uploadFileToFirebase(
            thumbnailFile,
            `thumbnails/${thumbnailFile.name}`,
            uploadedThumbnailURL
          )
        : uploadedThumbnailURL;

      if (!videoURL || !thumbnailURL) return;

      setMessage("Files uploaded. Adding video details...");
      const token = getCookie("idToken");
      const currentToken = new Date().getTime() / 1000;
      if (token === undefined || currentToken > (JSON.parse(atob((token || "").split('.')[1]))).exp) {
        alert("Token expired.");
        window.location.href = "/";
      }
      const response = await fetch(
        `https://webapi-zu6v4azneq-el.a.run.app/admin/course/${route}/edit-video/${videoId}`,
        {
          method: "PATCH",
          redirect: "follow",
          headers: { "Content-Type": "application/json", "Authentication": `Bearer ${token}` },
          body: JSON.stringify({
            url: videoURL,
            thumbnail: thumbnailURL,
            name,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Video Updated Successfully!");
        setSuccess(true);
        //setName("");  //Keep the name so the user sees it was updated
        //Only clear states when necessary
        if (videoFile) setVideoFile(null);
        if (thumbnailFile) {
          setThumbnailFile(null);
          setThumbnailPreview(null);
        }

        setUploadProgress(0);
        alert("Video Updated Successfully!");
        window.location.href = pathname.split("/edit-video")[0];
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
      <h1>Edit Video</h1>
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
          <label htmlFor="videoFile">Re-upload Video:</label>
          {uploadedVideoURL && (
            <p>
              Current Video: <a href={uploadedVideoURL}>{uploadedVideoURL}</a>
            </p>
          )}
          <input
            type="file"
            id="videoFile"
            accept="video/*"
            onChange={(e) => handleFileChange(e, "video")}
          />
        </div>
        <div className={styles["form-group"]}>
          <label htmlFor="thumbnailFile">Re-upload Thumbnail:</label>
          {uploadedThumbnailURL && (
            <p>
              Current Thumbnail:{" "}
              <a href={uploadedThumbnailURL}>{uploadedThumbnailURL}</a>
            </p>
          )}
          <input
            type="file"
            id="thumbnailFile"
            accept="image/*"
            onChange={(e) => handleFileChange(e, "thumbnail")}
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
          Edit Video
        </button>
      </form>
    </div>
  );
};

export default EditVideoPage;
