/* eslint-disable  @typescript-eslint/no-explicit-any */

"use client";
import React, { useState, useEffect, useRef } from "react";
import styles from "./AddCourseForm.module.css";
import { usePathname, useRouter } from "next/navigation";
import { getCookie } from "cookies-next/client";
import { BASE_URL } from "@/lib/constants";
import { BackButton } from "@/components/BackButton";
import { storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

interface Instructor {
  instructorId: string;
  name: string;
  bio: string;
  image: string;
  gpa: number;
  hours: number;
}

function AddCourseForm() {
  const [courseId, setCourseId] = useState("");
  const courseCategory = usePathname().split("/")[1]; // Extracting courseCategory from the URL
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploadMethod, setUploadMethod] = useState<"file" | "url">("file");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [instructorId, setInstructorId] = useState<string[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loadingInstructors, setLoadingInstructors] = useState(false);
  const [showInstructorDropdown, setShowInstructorDropdown] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<any>(null); // null, 'success', 'error'
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedInstructors = instructors.filter((inst: Instructor) =>
    instructorId.includes(inst.instructorId)
  );

  // Handle clicking outside dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowInstructorDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch instructors on component mount
  useEffect(() => {
    const fetchInstructors = async () => {
      setLoadingInstructors(true);
      try {
        const token = getCookie("idToken");
        const currentToken = new Date().getTime() / 1000;

        if (
          token === undefined ||
          currentToken > JSON.parse(atob((token || "").split(".")[1])).exp
        ) {
          alert("Token expired.");
          window.location.href = "/";
          return;
        }

        const response = await fetch(`${BASE_URL}/admin/instructors`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setInstructors(data || []);

          console.log("Response status:", response.status);
          console.log("Instructors data:", data);
        } else {
          console.error("Failed to fetch instructors");
          setMessage("Failed to load instructors");
          setStatus("error");
        }
      } catch (error) {
        console.error("Error fetching instructors:", error);
        setMessage("Failed to load instructors");
        setStatus("error");
      } finally {
        setLoadingInstructors(false);
      }
    };

    fetchInstructors();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setMessage("Please select a valid image file");
        setStatus("error");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setMessage("Image size should be less than 5MB");
        setStatus("error");
        return;
      }
      setImageFile(file);
      setStatus(null);
      setMessage("");
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImageToFirebase = async (file: File): Promise<string> => {
    try {
      setUploadingImage(true);
      const timestamp = Date.now();
      const fileName = `courses/${timestamp}_${file.name}`;
      const imageRef = ref(storage, fileName);
      const snapshot = await uploadBytes(imageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw new Error("Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
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
      let imageUrl = image;
      if (uploadMethod === "file" && imageFile) {
        try {
          imageUrl = await uploadImageToFirebase(imageFile);
        } catch (error) {
          setMessage("Failed to upload image. Please try again.");
          setStatus("error");
          return;
        }
      }
      const response = await fetch(`${BASE_URL}/admin/course`, {
        method: "POST",
        redirect: "follow",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          courseId,
          courseCategory,
          title,
          description,
          image: imageUrl,
          instructorId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Course added successfully!");
        setStatus("success");
        // Reset the form
        setCourseId("");
        setTitle("");
        setDescription("");
        setImage("");
        setInstructorId([]);
        setImageFile(null);
        setImagePreview("");
        setUploadMethod("file");

        // Navigate back to the course category page after a short delay
        setTimeout(() => {
          router.push(`/${courseCategory}`);
        }, 1500);
      } else {
        setMessage(data.message || "An error occurred.");
        setStatus("error");
      }
    } catch (error) {
      console.error("Error adding course:", error);
      setMessage("Failed to add course. Please try again.");
      setStatus("error");
    }
  };

  return (
    <div className={`${styles.container} h-screen overflow-auto w-full !p-24`}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h1>Add New Course</h1>
        <BackButton href={`/${courseCategory}`} />
      </div>
      {status === "success" && (
        <div className={styles.successMessage}>{message}</div>
      )}
      {status === "error" && (
        <div className={styles.errorMessage}>{message}</div>
      )}
      <form onSubmit={handleSubmit} className={styles.form}>
        <label htmlFor="courseId">Course ID:</label>
        <input
          type="text"
          id="courseId"
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
          required
        />

        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <label>Course Cover Image:</label>
        <div style={{ marginBottom: "1rem" }}>
          <div style={{ display: "flex", gap: "1rem", marginBottom: "0.5rem" }}>
            <label>
              <input
                type="radio"
                name="uploadMethod"
                value="file"
                checked={uploadMethod === "file"}
                onChange={() => setUploadMethod("file")}
              />{" "}
              Upload File
            </label>
            <label>
              <input
                type="radio"
                name="uploadMethod"
                value="url"
                checked={uploadMethod === "url"}
                onChange={() => setUploadMethod("url")}
              />{" "}
              Image URL
            </label>
          </div>
          {uploadMethod === "file" ? (
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                required={uploadMethod === "file"}
                disabled={uploadingImage}
                style={{ marginBottom: "0.5rem" }}
              />
              {uploadingImage && (
                <div
                  style={{
                    color: "#2563eb",
                    fontSize: "0.9rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  Uploading image...
                </div>
              )}
              {imagePreview && (
                <div style={{ marginBottom: "0.5rem" }}>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{
                      width: "80px",
                      height: "80px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      border: "1px solid #e5e7eb",
                    }}
                  />
                </div>
              )}
              <div style={{ fontSize: "0.8rem", color: "#6b7280" }}>
                Supported formats: JPG, PNG, GIF. Max size: 5MB
              </div>
            </div>
          ) : (
            <input
              type="url"
              id="image"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              required={uploadMethod === "url"}
              style={{ marginBottom: "0.5rem" }}
              placeholder="https://example.com/image.jpg"
            />
          )}
        </div>

        <label htmlFor="instructor">Instructors:</label>
        <div className={styles.selectedTags}>
          {selectedInstructors.length > 0 ? (
            selectedInstructors.map((inst) => (
              <span key={inst.instructorId} className={styles.selectedTag}>
                {inst.name}
              </span>
            ))
          ) : (
            <span className={styles.noSelection}>No instructors selected</span>
          )}
        </div>
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            className={styles.dropdownButton}
            onClick={() => setShowInstructorDropdown((prev) => !prev)}
            disabled={loadingInstructors}
          >
            {loadingInstructors
              ? "Loading instructors..."
              : "Select Instructors"}
            <span className="material-symbols-outlined">arrow_drop_down</span>
          </button>
          {showInstructorDropdown && (
            <div className={styles.dropdownMenu}>
              {instructors.map((instructor) => (
                <label
                  key={instructor.instructorId}
                  className={styles.dropdownItem}
                >
                  <input
                    type="checkbox"
                    checked={instructorId.includes(instructor.instructorId)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setInstructorId([
                          ...instructorId,
                          instructor.instructorId,
                        ]);
                      } else {
                        setInstructorId(
                          instructorId.filter(
                            (id) => id !== instructor.instructorId
                          )
                        );
                      }
                    }}
                  />
                  {instructor.name} (GPA: {instructor.gpa}, Hours:{" "}
                  {instructor.hours})
                </label>
              ))}
            </div>
          )}
        </div>

        <button type="submit" disabled={loadingInstructors || uploadingImage}>
          {uploadingImage ? "Uploading Image..." : "Add Course"}
        </button>
      </form>
    </div>
  );
}

export default AddCourseForm;
