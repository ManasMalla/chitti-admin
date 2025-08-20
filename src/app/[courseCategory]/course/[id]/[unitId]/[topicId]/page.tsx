/* eslint-disable  @typescript-eslint/no-explicit-any */
/* eslint-disable  @typescript-eslint/no-unused-vars */
"use client";
import app from "@/lib/firebase";
import { deleteObject, getStorage, ref } from "firebase/storage";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import "tailwindcss/index.css";
import { getCookie } from "cookies-next/client";
import { BASE_URL } from "@/lib/constants";

export default function Page() {
  const [courseData, setCourseData] = useState(undefined);
  const topicId = useParams().topicId;
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const courseCategory = pathname.split("/")[1];
  const courseId = pathname.split("course/")[1].split("/")[0];
  const backUrl = `/${courseCategory}/course/${courseId}`;

  useEffect(() => {
    const fetchData = async () => {
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
        `${BASE_URL}/admin/resource/${pathname.split("course/")[1]}/all`,
        {
          redirect: "follow",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setCourseData(data);
      setIsLoading(false);
      console.log(data);
    };
    fetchData();
  }, [topicId]);
  return courseData != undefined ? (
    <div className="p-8 overflow-scroll grow">
      <p className="uppercase font-bold opacity-50">
        {topicId?.toString().split("-").join(" ")}
      </p>
      <h2 className="text-4xl mb-2">Resources</h2>
      <Link
        href={backUrl}
        className="inline-block mb-6 py-2 px-4 bg-gray-200 text-gray-700 rounded text-sm font-medium"
      >
        ← Back to Course
      </Link>

      <h4 className="text-lg font-medium mt-8">Videos</h4>
      <ul className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(courseData["videos"] as any).map(
          (
            video:
              | {
                  videoId: string;
                  courseId: string;
                  unitId: string;
                  topicId: string;
                  url: string;
                  thumbnail: string;
                  name: string;
                }
              | any
          ) => (
            <li className="list-none ml-8 mb-2" key={video?.videoId}>
              <Link href={video.url}>
                <div className="relative flex w-max mb-4 rounded-xl overflow-hidden">
                  <img
                    src={video.thumbnail}
                    className="w-[300px] aspect-[1.8]"
                  />
                  <div className="bg-black/40 w-full h-full z-10 top-0 absolute" />
                  <span className="absolute material-symbols-outlined z-50 top-1/2 translate-y-[-50%] left-[150px] translate-x-[-50%] !text-5xl text-white">
                    play_circle
                  </span>
                </div>
              </Link>
              <div className="flex gap-4">
                <a className="font-medium">{video.name}</a>
                <a href={pathname + "/edit-video/" + video.videoId}>
                  <span className="material-symbols-outlined cursor-pointer">
                    edit
                  </span>
                </a>
                <button
                  onClick={() => {
                    if (
                      confirm("Are you sure you want to delete the reource?")
                    ) {
                      setIsLoading(true);
                      const storage = getStorage(app);
                      const storageRef = ref(storage, video.url);
                      const thumbnailRef = ref(storage, video.thumbnail);
                      Promise.all([
                        deleteObject(storageRef),
                        deleteObject(thumbnailRef),
                      ]).then(() => {
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
                          `${BASE_URL}/admin/resource/${
                            pathname.split("course/")[1]
                          }/video/${video.videoId}`,
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
                  <span className="material-symbols-outlined cursor-pointer">
                    delete
                  </span>
                </button>
              </div>
            </li>
          )
        )}
        <li className="text-orange-500 font-medium uppercase ml-4 border-2 border-orange-500 rounded-xl flex text-center items-center justify-center px-4 py-2 text-sm aspect-[1.8]">
          <a href={pathname + "/add-videos"}>Add video</a>
        </li>
      </ul>
      {/* <h4 className="text-lg font-medium mt-8">Important Questions</h4>
      <ul className="mt-4">
        {(courseData["importantQuestions"] as any).map((question: any) => (
          <li className="list-decimal ml-8 mb-2" key={question.iqId}>
            <div className="flex gap-4">
              <a>{question.question}</a>
              <a href={pathname + "/edit-important-question/" + question.iqId}>
                <span className="material-symbols-outlined cursor-pointer">
                  edit
                </span>
              </a>
              <button
                onClick={() => {
                  if (
                    confirm("Are you sure you want to delete the resource?")
                  ) {
                    fetch(
                      `${BASE_URL}/admin/${
                        pathname.split("course/")[1]
                      }/delete-iq/${question.iqId}`,
                      {
                        method: "DELETE",
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
                  }
                }}
              >
                <span className="material-symbols-outlined cursor-pointer">
                  delete
                </span>
              </button>
            </div>
          </li>
        ))}
        <li className="text-orange-500 font-medium uppercase ml-4 my-4 border-2 border-orange-500 rounded-full w-max px-4 py-2 text-sm">
          <a href={pathname + "/add-important-questions"}>Add questions</a>
        </li>
      </ul> */}
      <h4 className="text-lg font-medium mt-8">Notes</h4>
      <ul className="mt-4">
        {(courseData["notes"] as any).map((note: any) => (
          <li className="list-disc ml-8 mb-2" key={note.notesId}>
            <div className="flex gap-4">
              <a href={note.url}>{note.name}</a>
              <a href={pathname + "/edit-notes/" + note.notesId}>
                <span className="material-symbols-outlined cursor-pointer">
                  edit
                </span>
              </a>
              <button
                onClick={() => {
                  if (confirm("Are you sure you want to delete the reource?")) {
                    setIsLoading(true);
                    const storage = getStorage(app);
                    const storageRef = ref(storage, note.url);
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
                    deleteObject(storageRef).then(() => {
                      fetch(
                        `${BASE_URL}/admin/resource/${
                          pathname.split("course/")[1]
                        }/notes/${note.notesId}`,
                        {
                          method: "DELETE",
                          headers: {
                            Authorization: `Bearer ${token}`,
                          },
                          redirect: "follow",
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
                <span className="material-symbols-outlined cursor-pointer">
                  delete
                </span>
              </button>
            </div>
          </li>
        ))}
        <li className="text-orange-500 font-medium uppercase ml-4 my-4 border-2 border-orange-500 rounded-full w-max px-4 py-2 text-sm">
          <a href={pathname + "/add-notes"}>Add notes</a>
        </li>
      </ul>
      <h4 className="text-lg font-medium mt-8">Cheatsheets</h4>
      <ul className="mt-4">
        {(courseData["cheatsheets"] as any).map((cheatsheet: any) => (
          <li className="list-disc ml-8 mb-2" key={cheatsheet.cheatId}>
            <div className="flex gap-4">
              <a href={cheatsheet.url}>{cheatsheet.name}</a>
              <a href={pathname + "/edit-cheatsheet/" + cheatsheet.cheatId}>
                <span className="material-symbols-outlined cursor-pointer">
                  edit
                </span>
              </a>
              <button
                onClick={() => {
                  if (confirm("Are you sure you want to delete the reource?")) {
                    setIsLoading(true);
                    const storage = getStorage(app);
                    const storageRef = ref(storage, cheatsheet.url);
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
                    deleteObject(storageRef).then(() => {
                      fetch(
                        `${BASE_URL}/admin/resource/${
                          pathname.split("course/")[1]
                        }/cheatsheet/${cheatsheet.cheatId}`,
                        {
                          method: "DELETE",
                          headers: {
                            Authorization: `Bearer ${token}`,
                          },
                          redirect: "follow",
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
                <span className="material-symbols-outlined cursor-pointer">
                  delete
                </span>
              </button>
            </div>
          </li>
        ))}
        <li className="text-orange-500 font-medium uppercase ml-4 my-4 border-2 border-orange-500 rounded-full w-max px-4 py-2 text-sm">
          <a href={pathname + "/add-cheatsheet"}>Add cheatsheet</a>
        </li>
      </ul>
      {isLoading && (
        <div className="w-full left-0 h-full absolute bg-black/80 top-0 z-[100] flex items-center justify-center">
          <h1 className="text-white aspect-square h-auto flex items-center justify-center rounded-full p-8 bg-[#429EBD]">
            Loading...
          </h1>
        </div>
      )}
    </div>
  ) : (
    <div>Loading..</div>
  );
}
