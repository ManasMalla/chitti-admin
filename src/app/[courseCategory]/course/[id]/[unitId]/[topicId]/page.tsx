/* eslint-disable  @typescript-eslint/no-explicit-any */
/* eslint-disable  @typescript-eslint/no-unused-vars */
"use client";
import app from "@/lib/firebase";
import { deleteObject, getStorage, ref } from "firebase/storage";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import "tailwindcss/index.css";

export default function Page() {
  const [courseData, setCourseData] = useState(undefined);
  const topicId = useParams().topicId;
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `https://webapi-zu6v4azneq-el.a.run.app/admin/unit/${
          pathname.split("course/")[1]
        }/all`
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
                <span className="material-symbols-outlined cursor-pointer">
                  edit
                </span>
                <button
                  onClick={() => {
                    if (
                      confirm("Are you sure you want to delete the reource?")
                    ) {
                      setIsLoading(true);
                      const storage = getStorage(app);
                      const storageRef = ref(storage, video.url);
                      deleteObject(storageRef).then(() => {
                        fetch(
                          `http://127.0.0.1:5001/chitti-ananta/asia-south1/webApi/admin/${
                            pathname.split("course/")[1]
                          }/delete-video/${video.videoId}`,
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
      <h4 className="text-lg font-medium mt-8">Important Questions</h4>
      <ul className="mt-4">
        {(courseData["importantQuestions"] as any).map((question: any) => (
          <li className="list-decimal ml-8 mb-2" key={question.iqId}>
            <div className="flex gap-4">
              <a>{question.question}</a>
              <span className="material-symbols-outlined cursor-pointer">
                edit
              </span>
              <button
                onClick={() => {
                  if (
                    confirm("Are you sure you want to delete the resource?")
                  ) {
                    fetch(
                      `http://127.0.0.1:5001/chitti-ananta/asia-south1/webApi/admin/${
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
      </ul>
      <h4 className="text-lg font-medium mt-8">Notes</h4>
      <ul className="mt-4">
        {(courseData["notes"] as any).map((note: any) => (
          <li className="list-disc ml-8 mb-2" key={note.notesId}>
            <div className="flex gap-4">
              <a href={note.url}>{note.name}</a>
              <span className="material-symbols-outlined cursor-pointer">
                edit
              </span>
              <button
                onClick={() => {
                  if (confirm("Are you sure you want to delete the reource?")) {
                    setIsLoading(true);
                    const storage = getStorage(app);
                    const storageRef = ref(storage, note.url);
                    deleteObject(storageRef).then(() => {
                      fetch(
                        `http://127.0.0.1:5001/chitti-ananta/asia-south1/webApi/admin/${
                          pathname.split("course/")[1]
                        }/delete-notes/${note.notesId}`,
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
              <span className="material-symbols-outlined cursor-pointer">
                edit
              </span>
              <button
                onClick={() => {
                  if (confirm("Are you sure you want to delete the reource?")) {
                    setIsLoading(true);
                    const storage = getStorage(app);
                    const storageRef = ref(storage, cheatsheet.url);
                    deleteObject(storageRef).then(() => {
                      fetch(
                        `http://127.0.0.1:5001/chitti-ananta/asia-south1/webApi/admin/${
                          pathname.split("course/")[1]
                        }/delete-cheatsheet/${cheatsheet.cheatId}`,
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
