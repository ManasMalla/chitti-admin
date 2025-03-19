"use client";
import { useParams, useSearchParams } from "next/navigation";

export default function CoursePage() {
  const post = useParams();
  const courseId = post["id"];
  const courses = [
    {
      name: "Compiler Design",
      id: "CSEN3031",
    },
    {
      name: "Artificial Intelligence",
      id: "CSEN2071",
    },
    {
      name: "Quantum computing",
      id: "SENC101",
    },
  ];
  const course = courses.filter((e) => e.id == courseId)[0];
  return (
    <div className="content course-section">
      <div className="header-content">
        <h1>{course.name}</h1>
        <h4>{courseId}</h4>
      </div>
    </div>
  );
}
