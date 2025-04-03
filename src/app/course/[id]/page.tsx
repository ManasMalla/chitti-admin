"use client";
import CourseDetails from "@/components/course-details";
import { useParams, useSearchParams } from "next/navigation";

export default function CoursePage() {
  const post = useParams();
  const courseId = post["id"];
  const courses = [
    {
      name: "Compiler Design",
      id: "CSEN3031",
      units: [
        {
          name: "Compiler Design",
          description:
            "This unit covers the basics of compiler design, including lexical analysis and syntax analysis.",
          topics: [
            "Introduction to Compilers",
            "Lexical Analysis",
            "Finite Automata",
            "Regular Expressions",
            "Context-Free Grammars",
            "Parsing Techniques",
          ],
        },
        {
          name: "Semantic Analysis",
          description:
            "This unit covers semantic analysis and intermediate code generation.",
          topics: [
            "Syntax-Directed Translation",
            "Symbol Tables",
            "Type Checking",
            "Intermediate Code Generation",
          ],
        },
        {
          name: "Code Optimization",
          description:
            "This unit covers optimization techniques and code generation.",
          topics: [
            "Code Optimization Techniques",
            "Data Flow Analysis",
            "Code Generation Techniques",
          ],
        },
      ],
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
    <>
      <div className="content course-section">
        <div className="header-content py-[120px]">
          <h1 className="text-5xl">{course.name}</h1>
          <h4 className="text-xl font-semibold opacity-70">{courseId}</h4>
        </div>
        <CourseDetails units={course.units} courseId={courseId} />
      </div>
    </>
  );
}
