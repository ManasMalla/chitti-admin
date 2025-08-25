"use client";
/* eslint-disable  @typescript-eslint/no-explicit-any */
import app from "@/lib/firebase";
import { deleteObject, getStorage, ref } from "firebase/storage";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import "tailwindcss/index.css";
import { getCookie } from "cookies-next/client";
import { BASE_URL } from "@/lib/constants";

export default function CourseDetails(props: any) {
  const courseCategory = usePathname().split("/")[1];
  const backUrl = `/${courseCategory}`;
  const [isLoading, setIsLoading] = useState(false);
  const [editTopicModal, setEditTopicModal] = useState(false);
  const [editingTopic, setEditingTopic] = useState<any>(null);
  const [editUnitModal, setEditUnitModal] = useState(false);
  const [editingUnit, setEditingUnit] = useState<any>(null);

  const handleEditTopic = (topic: any) => {
    setEditingTopic(topic);
    setEditTopicModal(true);
  }

  const handleEditTopicSave = async () => {
    if (!editingTopic) return;
    try {
      setIsLoading(true);
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

      const response = await fetch(
        `${BASE_URL}/admin/topic/${props.courseId}/${editingTopic.unitId}/${editingTopic.id}`,
        {
          method: "PATCH",
          body: JSON.stringify(editingTopic),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          redirect: "follow",
        }
      )
      if (response.ok) {
        alert("Updated Successfully");
        setIsLoading(false);
        setEditTopicModal(false);
        setEditingTopic(null);
        window.location.reload();
      } else {
        alert("Failed to update");
        setIsLoading(false);
        console.log("update error", response);
      }
    } catch (error) {
      console.log("update error", error);
      setIsLoading(false);
      setEditTopicModal(false);
      setEditingTopic(null);
      alert("Failed to update");
    }
  }

  const handleEditUnit = (unit: any) => {
    setEditingUnit(unit);
    setEditUnitModal(true);
  }

  const handleEditUnitSave = async () => {
    if (!editingUnit) return;
    try {
      setIsLoading(true);
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

      const response = await fetch(
        `${BASE_URL}/admin/course/${props.courseId}/unit/${editingUnit.id}`,
        {
          method: "PATCH",
          body: JSON.stringify(editingUnit),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          redirect: "follow",
        }
      )
      if (response.ok) {
        alert("Updated Successfully");
        setIsLoading(false);
        setEditUnitModal(false);
        setEditingUnit(null);
        window.location.reload();
      } else {
        alert("Failed to update");
        setIsLoading(false);
        console.log("update error", response);
      }
    } catch (error) {
      console.log("update error", error);
      setIsLoading(false);
      setEditUnitModal(false);
      setEditingUnit(null);
      alert("Failed to update");
    }
  }

  const handleDeleteUnit = async (unit: any) => {
    if (!confirm("Are you sure you want to delete this unit? This will also delete all topics within it.")) {
      return;
    }

    try {
      setIsLoading(true);
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

      const response = await fetch(
        `${BASE_URL}/admin/unit/${props.courseId}/${unit.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          redirect: "follow",
        }
      )

      if (response.ok) {
        alert("Unit deleted successfully");
        setIsLoading(false);
        window.location.reload();
      } else {
        alert("Failed to delete unit");
        setIsLoading(false);
        console.log("delete error", response);
      }
    } catch (error) {
      console.log("delete error", error);
      setIsLoading(false);
      alert("Failed to delete unit");
    }
  }

  return (
    <>
      <div className="text-start p-8">
        <Link
          href={backUrl}
          className="w-fit flex items-center mb-6 py-2 px-4 bg-gray-200 text-gray-800 rounded text-sm font-medium"
        >
          <span className="material-symbols-outlined">
            chevron_left
          </span>
          Back to {courseCategory.split("-").join(" ").charAt(0).toUpperCase() + courseCategory.split("-").join(" ").slice(1)}
        </Link>
        <h2 className="text-3xl font-medium py-4">Course Description</h2>
        <p className="max-w-[48ch]">{props.description}</p>
        <div className="flex justify-between py-4 items-center">
          <h3 className="text-xl font-bold w-max">Units</h3>
          <a
            href={`/${courseCategory}/course/${props.courseId}/add-unit#${props.units.length + 1
              }`}
            className="bg-black text-white dark:bg-white dark:text-black py-2 px-4 rounded-full uppercase text-sm"
          >
            Add unit
          </a>
        </div>
        {props.units.map((unit: any, index: number) => (
          <div key={index} className="unit">
            <div className="flex items-center gap-4">
              <h4 className="text-lg font-medium py-4">
                Unit {index + 1}: {unit.unitName}
              </h4>
              <button
                onClick={() => handleEditUnit(unit)}
                className="border-2 border-blue-500 text-blue-500 py-1 px-2 rounded-full uppercase text-sm cursor-pointer">
                Edit Unit
              </button>
              <button
                onClick={() => handleDeleteUnit(unit)}
                className="border-2 border-red-500/80 text-red-500/80 py-1 px-2 rounded-full uppercase text-sm cursor-pointer">
                Delete Unit
              </button>
            </div>
            <p className="mb-8">{unit.description}</p>
            <div className="flex items-center mb-4 gap-4">
              <h5 className="text-lg font-bold h-max">Topics</h5>
              <a
                href={`/${courseCategory}/course/${props.courseId}/${unit.id}/add-topic#${index + 1}.${unit.topics.length + 1
                  }`}
                className="border rounded-full border-black dark:border-white text-black dark:text-white py-1.5 px-3 text-sm flex items-center gap-1 uppercase"
              >
                <span className="material-symbols-outlined cursor-pointer">
                  add
                </span>
                Add
              </a>
            </div>
            <ul>
              {unit.topics.map((topic: any, index: number) => (
                <li className="list-disc ml-8 mb-4 flex items-center gap-1" key={index}>
                  <a
                    className="hover:underline"
                    href={`/${courseCategory}/course/${props.courseId
                      }/${unit.id}/${topic.id
                      }`}
                  >
                    {topic.name}{" "}
                    <span className="opacity-50">
                      (
                      {topic.difficulty === "beginner"
                        ? 1
                        : topic.difficulty === "intermediate"
                          ? 2
                          : topic.difficulty == "advanced"
                            ? 3
                            : 0}
                      )
                    </span>
                  </a>
                  <button
                    onClick={() => {
                      handleEditTopic({ ...topic, unitId: unit.id });
                    }}
                    className="text-blue-500 p-2 text-sm flex items-center gap-1 uppercase cursor-pointer">
                    <span className="material-symbols-outlined">
                      edit
                    </span>
                    Edit
                  </button>
                  <button className="text-red-500/80 p-2 text-sm flex items-center gap-1 uppercase cursor-pointer"
                    onClick={
                      () => {
                        if (
                          confirm("Are you sure you want to delete the topic?")
                        ) {
                          setIsLoading(true);
                          const token = getCookie("idToken");
                          const currentToken = new Date().getTime() / 1000;
                          if (
                            token === undefined ||
                            currentToken >
                            JSON.parse(atob((token || "").split(".")[1])).exp
                          ) {
                            alert("Token expired.");
                            window.location.href = "/";
                          }
                          fetch(
                            `${BASE_URL}/admin/topic/${props.courseId}/${unit.id}/${topic.id}`,
                            {
                              method: "DELETE",
                              redirect: "follow",
                              headers: {
                                Authorization: `Bearer ${token}`,
                              },
                            }
                          )
                            .then((res) => res.json())
                            .then((data) => {
                              console.log("delete data", data);
                              if (data.status == true) {
                                alert("Deleted Successfully");
                                setIsLoading(false);
                                window.location.reload();
                              }
                            })
                            .catch((error) => {
                              alert("Failed to delete topic");
                              setIsLoading(false);
                              console.log("delete error", error);
                            });
                        }
                      }
                    }>
                    <span className="material-symbols-outlined">
                      delete
                    </span>
                    Delete
                  </button>
                </li>
              ))}
            </ul>
            <div className="my-4">
              <div className="flex items-center gap-2">
                <h5 className="text-lg font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined">
                    comment_bank
                  </span>
                  Important Questions
                </h5>
                {unit.importantQuestions.length <= 0 && (
                  <a
                    href={`/${courseCategory}/course/${props.courseId}/${unit.id}/add-important-questions`}
                    className="w-fit border rounded-full border-black dark:border-white text-black dark:text-white py-1 px-2 text-sm flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined cursor-pointer">
                      add
                    </span>
                    Add
                  </a>
                )}
              </div>
              {unit.importantQuestions.length > 0 && (
                <div className="flex items-center gap-4 my-3">
                  <a href={unit.importantQuestions[0].url} className="flex items-center gap-1 text-black dark:text-white">
                    <span className="material-symbols-outlined cursor-pointer">
                      visibility
                    </span>
                    View
                  </a>
                  <button
                    className="flex items-center gap-1 text-red-500/80 cursor-pointer"
                    onClick={() => {
                      if (
                        confirm("Are you sure you want to delete the reource?")
                      ) {
                        setIsLoading(true);
                        const storage = getStorage(app);
                        const storageRef = ref(
                          storage,
                          unit.importantQuestions[0].url
                        );
                        const token = getCookie("idToken");
                        const currentToken = new Date().getTime() / 1000;
                        if (
                          token === undefined ||
                          currentToken >
                          JSON.parse(atob((token || "").split(".")[1])).exp
                        ) {
                          alert("Token expired.");
                          window.location.href = "/";
                        }
                        Promise.all([deleteObject(storageRef)]).then(() => {
                          fetch(
                            `${BASE_URL}/admin/resource/${unit.importantQuestions[0].courseId}/${unit.importantQuestions[0].unitId}/iq/${unit.importantQuestions[0].iqId}`,
                            {
                              method: "DELETE",
                              redirect: "follow",
                              headers: {
                                Authorization: `Bearer ${token}`,
                              },
                            }
                          )
                            .then((res) => res.json())
                            .then((data) => {
                              console.log("delete data", data);
                              if (data.status == true) {
                                alert("Deleted Successfully");
                                setIsLoading(false);
                                window.location.reload();
                              }
                            })
                            .catch((error) => {
                              console.log("delete error", error);
                            });
                        });
                      }
                    }}
                  >
                    <span className="material-symbols-outlined">
                      delete
                    </span>
                    Delete
                  </button>
                </div>
              )}
            </div>
            <div className="my-4">
              <div className="flex items-center gap-2">
                <h5 className="text-lg font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined">
                    article
                  </span>
                  Cheatsheet
                </h5>
                {unit.cheatsheet.length <= 0 && (
                  <a
                    href={`/${courseCategory}/course/${props.courseId}/${unit.id}/add-cheatsheet`}
                    className="w-fit border rounded-full border-black dark:border-white text-black dark:text-white py-1 px-2 text-sm flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined cursor-pointer">
                      add
                    </span>
                    Add
                  </a>
                )}
              </div>
              {unit.cheatsheet.length > 0 && (
                <div className="flex items-center gap-4 my-3">
                  <a href={unit.cheatsheet[0].url} className="flex items-center gap-1 text-black dark:text-white">
                    <span className="material-symbols-outlined cursor-pointer">
                      visibility
                    </span>
                    View
                  </a>
                  <button
                    className="flex items-center gap-1 text-red-500/80 cursor-pointer"
                    onClick={() => {
                      if (
                        confirm("Are you sure you want to delete the reource?")
                      ) {
                        setIsLoading(true);
                        const storage = getStorage(app);
                        const storageRef = ref(
                          storage,
                          unit.cheatsheet[0].url
                        );
                        const token = getCookie("idToken");
                        const currentToken = new Date().getTime() / 1000;
                        if (
                          token === undefined ||
                          currentToken >
                          JSON.parse(atob((token || "").split(".")[1])).exp
                        ) {
                          alert("Token expired.");
                          window.location.href = "/";
                        }
                        Promise.all([deleteObject(storageRef)]).then(() => {
                          fetch(
                            `${BASE_URL}/admin/resource/${unit.cheatsheet[0].courseId}/${unit.cheatsheet[0].unitId}/cheatsheet/${unit.cheatsheet[0].cheatId}`,
                            {
                              method: "DELETE",
                              redirect: "follow",
                              headers: {
                                Authorization: `Bearer ${token}`,
                              },
                            }
                          )
                            .then((res) => res.json())
                            .then((data) => {
                              console.log("delete data", data);
                              if (data.status == true) {
                                alert("Deleted Successfully");
                                setIsLoading(false);
                                window.location.reload();
                              }
                            })
                            .catch((error) => {
                              console.log("delete error", error);
                            });
                        });
                      }
                    }}
                  >
                    <span className="material-symbols-outlined">
                      delete
                    </span>
                    Delete
                  </button>
                </div>
              )}
            </div>
            <hr className="h-1 mx-auto my-10 bg-[#f26e0c] border-0 rounded-sm" />
          </div>
        ))}
        {isLoading && (
          <div className="w-full left-0 h-full absolute bg-black/80 top-0 z-[100] flex items-center justify-center">
            <h1 className="text-white aspect-square h-auto flex items-center justify-center rounded-full p-8 bg-[#429EBD]">
              Loading...
            </h1>
          </div>
        )}

        {/* Edit Topic Modal */}
        {editTopicModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">Edit Topic</h2>
              <form
                className="text-start"
                onSubmit={e => {
                  e.preventDefault();
                  handleEditTopicSave();
                }}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-black dark:text-white">
                    Topic Name
                  </label>
                  <input
                    type="text"
                    value={editingTopic.name}
                    onChange={e => setEditingTopic({ ...editingTopic, name: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 text-black dark:text-white bg-white dark:bg-gray-700"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-black dark:text-white">
                    Difficulty
                  </label>
                  <select
                    value={editingTopic.difficulty}
                    onChange={e => setEditingTopic({ ...editingTopic, difficulty: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 text-black dark:text-white bg-white dark:bg-gray-700"
                    required
                  >
                    <option value="">Select Difficulty</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditTopicModal(false);
                    }}
                    className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 text-black dark:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded bg-blue-600 text-white cursor-pointer"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Unit Modal */}
        {editUnitModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">Edit Unit</h2>
              <form
                className="text-start"
                onSubmit={e => {
                  e.preventDefault();
                  handleEditUnitSave();
                }}>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-black dark:text-white">
                    Unit Number
                  </label>
                  <input
                    type="number"
                    value={editingUnit.unitNo || ""}
                    onChange={e => setEditingUnit({ ...editingUnit, unitNo: parseInt(e.target.value) })}
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 text-black dark:text-white bg-white dark:bg-gray-700"
                    min="1"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-black dark:text-white">
                    Unit Name
                  </label>
                  <input
                    type="text"
                    value={editingUnit.unitName}
                    onChange={e => setEditingUnit({ ...editingUnit, unitName: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 text-black dark:text-white bg-white dark:bg-gray-700"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-black dark:text-white">
                    Unit Description
                  </label>
                  <textarea
                    value={editingUnit.description}
                    onChange={e => setEditingUnit({ ...editingUnit, description: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 text-black dark:text-white bg-white dark:bg-gray-700"
                    rows={4}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-black dark:text-white">
                    Difficulty
                  </label>
                  <select
                    value={editingUnit.difficulty || ""}
                    onChange={e => setEditingUnit({ ...editingUnit, difficulty: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 text-black dark:text-white bg-white dark:bg-gray-700"
                    required
                  >
                    <option value="">Select Difficulty</option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditUnitModal(false);
                      setEditingUnit(null);
                    }}
                    className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 text-black dark:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded bg-blue-600 text-white cursor-pointer"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
