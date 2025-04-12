/* eslint-disable  @typescript-eslint/no-explicit-any */
/* eslint-disable  @typescript-eslint/no-unused-vars */
"use client";
import CourseDetails from "@/components/course-details";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {getCookie} from "cookies-next/client";

export default function CoursePage() {
  const post = useParams();
  const courseId = post["id"];
  const [course, setCourse] = useState<any>(undefined);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const token = getCookie("idToken");
    const currentToken = new Date().getTime() / 1000;
    if(currentToken > (JSON.parse(atob((token || "").split('.')[1]))).exp){
      alert("Token expired.");
      window.location.href = "/";
    }

    fetch(`https://webapi-zu6v4azneq-el.a.run.app/admin/course/${courseId}`, {
      redirect: "follow",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
      .then((response) => response.json())
      .then((data) => {
        const apiResponse = data;
        const formattedData = {
          name: apiResponse.title,
          id: apiResponse.courseId,
          image: apiResponse.image,
          description: apiResponse.description,
          units: apiResponse.units.map((unit: any) => ({
            id: unit.unitId,
            name: unit.name,
            description: unit.description,
            importantQuestions: unit.importantQuestions,
            topics: unit.roadmap.map((topic: any) => {
              return {
                name: topic.name,
                id: topic.roadId,
                difficulty: topic.difficulty,
              };
            }), // Or modify this if needed
          })),
        };
        setCourse(formattedData);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, [courseId]);
  return (
    <>
      {course != undefined && (
        <div className="content course-section">
          <div
            className={`header-content py-[120px]`}
            style={{
              background: `url(${course.image})`,
              backgroundPosition: "center",
              position: "relative",
            }}
          >
            <h1 className="text-5xl">{course.name}</h1>
            <h4 className="text-xl font-semibold opacity-70">{courseId}</h4>
            <button
              onClick={() => {
                const newURL = prompt("New Image URL");
                console.log(newURL);
                const token = getCookie("idToken");
                const currentToken = new Date().getTime() / 1000;
                if(currentToken > (JSON.parse(atob((token || "").split('.')[1]))).exp){
                  alert("Token expired.");
                  window.location.href = "/";
                }
                if (newURL) {
                  fetch(
                    `https://webapi-zu6v4azneq-el.a.run.app/admin/edit-course/${courseId}`,
                    {
                      method: "PATCH",
                      body: JSON.stringify({
                        image: newURL,
                      }),
                      headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                      },
                      redirect: "follow"
                    }
                  )
                    .then((res) => res.json())
                    .then((data) => {
                      console.log("update data", data);
                      if (data.image) {
                        alert("Updated Successfully");
                        window.location.reload();
                      }
                    })
                    .catch((error) => {
                      console.log("update error", error);
                    });
                }
              }}
              className="cursor-pointer material-symbols-outlined absolute bg-black p-3 !text-[1.2rem] rounded-full top-2 right-4"
            >
              <span className="material-symbols-outlined !text-[1.2rem]">
                edit
              </span>
            </button>
          </div>
          <CourseDetails
            description={course.description}
            units={course.units}
            courseId={courseId}
          />
        </div>
      )}
    </>
  );
}
