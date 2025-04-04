/* eslint-disable  @typescript-eslint/no-explicit-any */
/* eslint-disable  @typescript-eslint/no-unused-vars */
// pages/admin/editIq.js
"use client";
import { useState, useCallback, useEffect } from "react";
import styles from "./AddIq.module.css";
import { useRouter } from "next/navigation";
import { usePathname, useParams } from "next/navigation";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage"; // Firebase imports
import app from "@/lib/firebase";

interface FormState {
  tag: string;
  question: string;
  answer: string;
}

const EditIqPage = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { iqId } = useParams(); // Get iqId from route

  const route = pathname
    .split("/course/")[1]
    .split("/edit-important-question")[0]; // Correct route extraction

  const [formState, setFormState] = useState<FormState>({
    tag: "",
    question: "",
    answer: "",
  });
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [downloadURLs, setDownloadURLs] = useState<string[]>([]);
  const [existingImageURLs, setExistingImageURLs] = useState<string[]>([]); // Added for existing images
  const [uploading, setUploading] = useState(false); // Track image uploading state

  useEffect(() => {
    const fetchIqDetails = async () => {
      try {
        const response = await fetch(
          `https://webapi-zu6v4azneq-el.a.run.app/admin/${route}/get-iq/${iqId}`
        );
        const data = await response.json();

        if (response.ok) {
          setFormState({
            tag: data.tag,
            question: data.question,
            answer: data.answer,
          });
          const regex = /\[(https?:\/\/[^\]]+)\]\(markdown\)/g;

          const matches = [
            ...data.question.matchAll(regex),
            ...data.answer.matchAll(regex),
          ].map((match) => match[1]);
          const imageUrlsRegex = setExistingImageURLs(matches || []); // Load existing image URLs
          setDownloadURLs(matches || []); // Initialize downloadURLs with existing images
          setMessage("Important Question details fetched successfully.");
          setSuccess(true);
        } else {
          setMessage(
            data.message || "Error fetching important question details."
          );
          setSuccess(false);
        }
      } catch (error) {
        console.error("Error:", error);
        setMessage("An unexpected error occurred.");
        setSuccess(false);
      }
    };

    fetchIqDetails();
  }, [iqId, route]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedImages(Array.from(e.target.files)); // Convert FileList to array
    }
  };

  const handleUpload = useCallback(async () => {
    if (!selectedImages.length) {
      setMessage("Please select images to upload.");
      setSuccess(false);
      return;
    }

    setUploading(true);
    setMessage("Uploading images..."); // Provide user feedback
    setSuccess(false);
    const storage = getStorage(app);
    const urls: string[] = [];

    try {
      for (const image of selectedImages) {
        const storageRef = ref(storage, `iqs/images/${image.name}`); // Unique path
        await uploadBytes(storageRef, image); // Upload the file

        const downloadURL = await getDownloadURL(storageRef);
        urls.push(downloadURL);
      }

      setDownloadURLs([...downloadURLs, ...urls]); // Add new URLs to existing
      setMessage("Images uploaded successfully!");
      setSuccess(true);
      setSelectedImages([]); // Clear selected images after upload
    } catch (error: any) {
      console.error("Upload error:", error);
      setMessage(`Upload failed: ${error.message}`);
      setSuccess(false);
    } finally {
      setUploading(false);
    }
  }, [selectedImages, downloadURLs]);

  const handleDeleteImage = async (urlToDelete: string) => {
    try {
      const storage = getStorage(app);
      const imageRef = ref(storage, urlToDelete);

      await deleteObject(imageRef);

      setFormState((prevState) => ({
        ...prevState,
        question: prevState.question.replaceAll(
          `[${urlToDelete}](markdown)`,
          ""
        ),
        answer: prevState.answer.replaceAll(`[${urlToDelete}](markdown)`, ""),
      }));
      // Remove the deleted URL from both downloadURLs and existingImageURLs

      setDownloadURLs((prevURLs) =>
        prevURLs.filter((url) => url !== urlToDelete)
      );
      setExistingImageURLs((prevURLs) =>
        prevURLs.filter((url) => url !== urlToDelete)
      );

      setMessage("Image deleted successfully!");
      setSuccess(true);
    } catch (error: any) {
      console.error("Delete error:", error);
      setMessage(`Delete failed: ${error.message}`);
      setSuccess(false);
    }
  };

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setMessage("URL copied to clipboard!");
    alert("URL copied to clipboard!");
    setSuccess(true);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setMessage(""); // Clear previous messages

    try {
      const response = await fetch(
        `https://webapi-zu6v4azneq-el.a.run.app/admin/${route}/edit-iq/${iqId}`, // Changed to edit-iq
        {
          method: "PATCH", // Changed to PATCH
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...formState, imageUrls: downloadURLs }), // Send URLs to the backend
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Important Question Updated Successfully!");
        setSuccess(true);
        //setFormState({ tag: "", question: "", answer: "" }); // Keep the form state
        //setSelectedImages([]); // Clear selected images.  Consider conditional clearing
        //setDownloadURLs([]); // Clear download URLs. Consider conditional clearing
        router.push(pathname.split("/edit-important-question")[0]);
      } else {
        setMessage(data.message || "Error updating important question.");
        setSuccess(false);
      }
    } catch (error: any) {
      console.error("Error:", error);
      setMessage(
        error instanceof TypeError
          ? "Network error.  Please check your connection."
          : "An unexpected error occurred."
      );
      setSuccess(false);
    } finally {
      setLoading(false);
      setUploading(false); // Ensure uploading is also reset on form submit
    }
  };

  return (
    <div className={styles["add-iq-container"]}>
      <h1>Edit Important Question</h1>
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
            value={formState.tag}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles["form-group"]}>
          <label htmlFor="question">Question:</label>
          <textarea
            id="question"
            value={formState.question}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles["form-group"]}>
          <label htmlFor="answer">Answer:</label>
          <textarea
            id="answer"
            value={formState.answer}
            onChange={handleChange}
            required
          />
        </div>

        {/* Image Upload Section */}
        <div className={styles["form-group"]}>
          <label htmlFor="image">Upload Images:</label>
          <input
            type="file"
            id="image"
            multiple // Allow multiple file selection
            onChange={handleImageChange}
            accept="image/*" // Accept only image files
          />
          {selectedImages.length > 0 && (
            <div>
              <p>Selected Images:</p>
              <ul>
                {selectedImages.map((image, index) => (
                  <li key={index}>{image.name}</li>
                ))}
              </ul>
            </div>
          )}

          <button
            type="button"
            onClick={handleUpload}
            disabled={uploading}
            className={styles["submit-button"]}
          >
            {uploading ? "Uploading..." : "Upload Images"}
          </button>

          {(downloadURLs.length > 0 || existingImageURLs.length > 0) && (
            <div>
              <p>Uploaded Image URLs:</p>
              <ul>
                {downloadURLs.map((url, index) => (
                  <li key={index}>
                    <a href={url} target="_blank" rel="noopener noreferrer">
                      {url}
                    </a>
                    <button
                      type="button"
                      onClick={() => handleCopy(`[${url}](markdown)`)}
                    >
                      Copy URL
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteImage(url)}
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <button
          type="submit"
          className={styles["submit-button"]}
          disabled={loading || uploading} // Disable during upload
        >
          {loading ? "Updating..." : "Update Question"}
        </button>
      </form>
    </div>
  );
};

export default EditIqPage;
