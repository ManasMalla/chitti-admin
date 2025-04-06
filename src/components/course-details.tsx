"use client";
/* eslint-disable  @typescript-eslint/no-explicit-any */
import app from "@/lib/firebase";
import { deleteObject, getStorage, ref } from "firebase/storage";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import "tailwindcss/index.css";

export default function CourseDetails(props: any) {
  const courseCategory = usePathname().split("/")[1];
  const backUrl = `/${courseCategory}`;
  const [isLoading, setIsLoading] = useState(false);
  return (
    <>
      <div className="text-start p-8">
        <Link
          href={backUrl}
          className="inline-block mb-6 py-2 px-4 bg-gray-200 text-gray-700 rounded text-sm font-medium"
        >
          ← Back to Category
        </Link>
        <h2 className="text-3xl font-medium py-4">Course Description</h2>
        <p className="max-w-[48ch]">{props.description}</p>
        <div className="flex justify-between py-4 items-center">
          <h3 className="text-xl font-bold w-max">Units</h3>
          <a
            href={`/${courseCategory}/course/${props.courseId}/add-unit#${
              props.units.length + 1
            }`}
            className="bg-black text-white py-2 px-4 rounded-full uppercase text-sm"
          >
            Add unit
          </a>
        </div>
        {props.units.map((unit: any, index: number) => (
          <div key={index} className="unit">
            <h4 className="text-lg font-medium py-4">
              Unit {index + 1}: {unit.name}
            </h4>
            <p className="mb-8">{unit.description}</p>
            <div className="flex items-center  mb-4 gap-4">
              <h5 className="text-lg font-bold h-max">Topics</h5>
              <a
                href={`/${courseCategory}/course/${props.courseId}/${unit.name
                  .split(" ")
                  .join("-")
                  .toLowerCase()}/add-topic#${index + 1}.${
                  unit.topics.length + 1
                }`}
                className="border-black border-2 py-2 px-4 rounded-full text-sm uppercase"
              >
                Add topic
              </a>
            </div>
            <ul>
              {unit.topics.map((topic: any, index: number) => (
                <li className="list-disc ml-8 mb-4" key={index}>
                  <a
                    href={`/${courseCategory}/course/${
                      props.courseId
                    }/${unit.name.split(" ").join("-").toLowerCase()}/${
                      topic.id
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
                    </span>{" "}
                    {">"}
                  </a>
                  <button
                    onClick={() => {
                      const newDifficulty = prompt(
                        "Enter new difficulty (N/A-0, beginner-1, intermediate-2, advanced-3)"
                      );

                      if (
                        newDifficulty !== "0" &&
                        newDifficulty !== "1" &&
                        newDifficulty !== "2" &&
                        newDifficulty !== "3"
                      ) {
                        alert("Please enter a valid difficulty level");
                        return;
                      }
                      const newDifficultyText =
                        parseInt(newDifficulty) == 0
                          ? "no-difficulty"
                          : parseInt(newDifficulty) == 1
                          ? "beginner"
                          : parseInt(newDifficulty) == 2
                          ? "intermediate"
                          : "advanced";
                      if (newDifficulty) {
                        console.log(
                          "new difficulty",
                          newDifficulty,
                          props.courseId,
                          unit.id,
                          topic.id
                        );

                        setIsLoading(true);
                        fetch(
                          `https://webapi-zu6v4azneq-el.a.run.app/admin/${props.courseId}/${unit.id}/edit-roadmap/${topic.id}`,
                          {
                            method: "PATCH",
                            body: JSON.stringify({
                              difficulty: newDifficultyText,
                            }),
                            headers: {
                              "Content-Type": "application/json",
                            },
                          }
                        )
                          .then((res) => res.json())
                          .then((data) => {
                            console.log("update data", data);
                            if (data.difficulty) {
                              alert("Updated Successfully");
                              setIsLoading(false);
                              window.location.reload();
                            }
                          })
                          .catch((error) => {
                            console.log("update error", error);
                          });
                      }
                    }}
                    className="ml-4 border-2 border-black text-[10px] p-2 rounded-xl uppercase font-medium"
                  >
                    Update difficulty
                  </button>
                </li>
              ))}
            </ul>
            <div className="flex items-center  mb-4 gap-4">
              <h5 className="text-lg font-bold h-max">Important Questions</h5>
              {unit.importantQuestions.length <= 0 ? (
                <a
                  href={`/${courseCategory}/course/${props.courseId}/${unit.name
                    .split(" ")
                    .join("-")
                    .toLowerCase()}/add-important-questions`}
                  className="border-orange-500 text-orange-500 border-2 py-2 px-4 rounded-full text-sm uppercase"
                >
                  Add question
                </a>
              ) : (
                <>
                  <a href={unit.importantQuestions[0].url}>
                    <span className="material-symbols-outlined cursor-pointer">
                      visibility
                    </span>
                  </a>
                  <button
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
                        Promise.all([deleteObject(storageRef)]).then(() => {
                          fetch(
                            `https://webapi-zu6v4azneq-el.a.run.app/admin/${unit.importantQuestions[0].courseId}/${unit.importantQuestions[0].unitId}/delete-iq/${unit.importantQuestions[0].iqId}`,
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
                </>
              )}
            </div>
            <hr className="h-1 mx-auto my-10 bg-orange-200 border-0 rounded-sm" />
          </div>
        ))}
        {isLoading && (
          <div className="w-full left-0 h-full absolute bg-black/80 top-0 z-[100] flex items-center justify-center">
            <h1 className="text-white aspect-square h-auto flex items-center justify-center rounded-full p-8 bg-[#429EBD]">
              Loading...
            </h1>
          </div>
        )}
      </div>
    </>
  );
}
