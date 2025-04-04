/* eslint-disable  @typescript-eslint/no-explicit-any */
/* eslint-disable  @typescript-eslint/no-unused-vars */
"use client";
import CourseDetails from "@/components/course-details";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function CoursePage() {
  const post = useParams();
  const courseId = post["id"];
  const [course, setCourse] = useState<any>(undefined);
  useEffect(() => {
    if (typeof window === "undefined") return;
    fetch(`https://webapi-zu6v4azneq-el.a.run.app/admin/${courseId}`)
      .then((response) => response.json())
      .then((data) => {
        const apiResponse = data;
        const formattedData = {
          name: apiResponse.title,
          id: apiResponse.courseId,
          image: apiResponse.image,
          description: apiResponse.description,
          units: apiResponse.units.map((unit: any) => ({
            name: unit.name,
            description: unit.description,
            topics: unit.roadmap.map((topic: any) => {
              return {
                name: topic.name,
                id: topic.roadId,
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
            }}
          >
            <h1 className="text-5xl">{course.name}</h1>
            <h4 className="text-xl font-semibold opacity-70">{courseId}</h4>
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
