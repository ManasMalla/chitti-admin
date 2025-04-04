/* eslint-disable  @typescript-eslint/no-explicit-any */
/* eslint-disable  @typescript-eslint/no-unused-vars */
// pages/admin/addIq.js
"use client";
import { useState, useCallback } from "react";
import styles from "./AddIq.module.css";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Firebase imports
import app from "@/lib/firebase";

interface FormState {
  tag: string;
  question: string;
  answer: string;
}

const AddIqPage = () => {
  const pathname = usePathname();
  const router = useRouter();

  const route = pathname
    .split("/course/")[1]
    .replace("/add-important-questions", "");

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
  const [uploading, setUploading] = useState(false); // Track image uploading state

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

      setDownloadURLs([...downloadURLs, ...urls]);
      setMessage("Images uploaded successfully!");
      setSuccess(true);
      setSelectedImages([]); // Clear selected images after upload
      setUploading(false); // Reset uploading state
    } catch (error: any) {
      console.error("Upload error:", error);
      setMessage(`Upload failed: ${error.message}`);
      setSuccess(false);
    } finally {
      setUploading(false);
    }
  }, [selectedImages]);

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
        `https://webapi-zu6v4azneq-el.a.run.app/admin/${route}/addIq`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...formState, imageUrls: downloadURLs }), // Send URLs to the backend
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Important Question Added Successfully!");
        setSuccess(true);
        setFormState({ tag: "", question: "", answer: "" }); // Clear form
        setSelectedImages([]); // Clear selected images
        setDownloadURLs([]); // Clear download URLs
        router.push(pathname.replace("/add-important-questions", ""));
      } else {
        setMessage(data.message || "Error adding important question.");
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

          {downloadURLs.length > 0 && (
            <div>
              <p>Uploaded Image URLs:</p>
              <ul>
                {downloadURLs.map((url, index) => (
                  <li key={index}>
                    <a href={url} target="_blank" rel="noopener noreferrer">
                      {url}
                    </a>
                    <button type="button" onClick={() => handleCopy(url)}>
                      Copy URL
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
          {loading ? "Adding..." : "Add Question"}
        </button>
      </form>
    </div>
  );
};

export default AddIqPage;
