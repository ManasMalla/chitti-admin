"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next/client";
import { storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { BASE_URL } from "@/lib/constants";
import "tailwindcss/index.css";

export default function AddInstructorPage() {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploadMethod, setUploadMethod] = useState<"file" | "url">("file");
  const [bio, setBio] = useState("");
  const [gpa, setGpa] = useState("");
  const [hours, setHours] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"success" | "error" | null>(null);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setMessage("Please select a valid image file");
        setStatus("error");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage("Image size should be less than 5MB");
        setStatus("error");
        return;
      }

      setImageFile(file);
      setStatus(null);
      setMessage("");

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // const convertFileToBase64 = (file: File): Promise<string> => {
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.readAsDataURL(file);
  //     reader.onload = () => resolve(reader.result as string);
  //     reader.onerror = (error) => reject(error);
  //   });
  // };

  const uploadImageToFirebase = async (file: File): Promise<string> => {
    try {
      setUploadingImage(true);

      // Create a unique filename
      const timestamp = Date.now();
      const fileName = `instructors/${timestamp}_${file.name}`;

      // Create a reference to Firebase Storage
      const imageRef = ref(storage, fileName);

      // Upload the file
      const snapshot = await uploadBytes(imageRef, file);

      // Get the download URL
      const downloadURL = await getDownloadURL(snapshot.ref);

      return downloadURL;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw new Error("Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    setMessage("");

    try {
      const token = getCookie("idToken");
      const currentToken = new Date().getTime() / 1000;

      if (
        token === undefined ||
        currentToken > JSON.parse(atob((token || "").split(".")[1])).exp
      ) {
        setMessage("Token expired. Please login again.");
        setStatus("error");
        setLoading(false);
        return;
      }

      let imageUrl = image;

      // Upload image to Firebase if file is selected
      if (uploadMethod === "file" && imageFile) {
        try {
          imageUrl = await uploadImageToFirebase(imageFile);
        } catch (error) {
          setMessage("Failed to upload image. Please try again.");
          setStatus("error");
          setLoading(false);
          console.log("Error uploading image:", error);
          return;
        }
      }

      const response = await fetch(`${BASE_URL}/admin/instructor`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          image: imageUrl,
          bio,
          gpa: parseFloat(gpa),
          hours: parseInt(hours),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Instructor added successfully!");
        setStatus("success");
        setTimeout(() => {
          router.push("/instructors");
        }, 1500);
      } else {
        setMessage(data.message || "Failed to add instructor");
        setStatus("error");
      }
    } catch (error) {
      console.error("Error adding instructor:", error);
      setMessage("Failed to add instructor. Please try again.");
      setStatus("error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          Add New Instructor
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Fill in the details below to add a new instructor
        </p>
      </div>

      {status === "success" && (
        <div className="bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-400 dark:border-green-600 px-4 py-2 rounded-md mb-6">
          {message}
        </div>
      )}

      {status === "error" && (
        <div className="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-400 dark:border-red-600 px-4 py-2 rounded-md mb-6">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Name *
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            type="text"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400"
            placeholder="Enter instructor name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Profile Image *
          </label>

          {/* Upload method selector */}
          <div className="flex gap-4 mb-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="uploadMethod"
                value="file"
                checked={uploadMethod === "file"}
                onChange={(e) =>
                  setUploadMethod(e.target.value as "file" | "url")
                }
                className="mr-2 text-blue-600 dark:text-blue-400"
              />
              <span className="text-gray-700 dark:text-gray-300">
                Upload File
              </span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="uploadMethod"
                value="url"
                checked={uploadMethod === "url"}
                onChange={(e) =>
                  setUploadMethod(e.target.value as "file" | "url")
                }
                className="mr-2 text-blue-600 dark:text-blue-400"
              />
              <span className="text-gray-700 dark:text-gray-300">
                Image URL
              </span>
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
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 dark:file:bg-blue-900/20 file:text-blue-700 dark:file:text-blue-400 hover:file:bg-blue-100 dark:hover:file:bg-blue-900/30 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              {uploadingImage && (
                <div className="mt-2 text-sm text-blue-600 dark:text-blue-400">
                  Preparing image for upload...
                </div>
              )}
              {imagePreview && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Preview:
                  </p>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-24 h-24 object-cover rounded-full border-2 border-gray-300 dark:border-gray-600"
                  />
                </div>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Supported formats: JPG, PNG, GIF. Max size: 5MB
              </p>
            </div>
          ) : (
            <input
              value={image}
              onChange={(e) => setImage(e.target.value)}
              required={uploadMethod === "url"}
              type="url"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400"
              placeholder="https://example.com/image.jpg"
            />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Bio *
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            required
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400"
            placeholder="Enter instructor bio/description"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              GPA *
            </label>
            <input
              value={gpa}
              onChange={(e) => setGpa(e.target.value)}
              required
              type="number"
              step="0.01"
              min="0"
              max="10"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400"
              placeholder="3.5"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Teaching Hours *
            </label>
            <input
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              required
              type="number"
              min="1"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400"
              placeholder="40"
            />
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading || uploadingImage}
            className="flex-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 disabled:bg-blue-400 dark:disabled:bg-blue-600 text-white font-medium py-3 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          >
            {uploadingImage
              ? "Uploading Image..."
              : loading
              ? "Adding Instructor..."
              : "Add Instructor"}
          </button>

          <button
            type="button"
            onClick={() => router.push("/instructors")}
            disabled={loading || uploadingImage}
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 font-medium rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
