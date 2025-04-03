"use client";
import { useParams } from "next/navigation";
// import Image from "next/image";
// import styles from "./page.module.css";
// import Link from "next/link";

import { useEffect, useState } from "react";

export default function Home() {
  const {courseCategory} = useParams();
  const [courses, setCourses] = useState<any>([]);
  useEffect(()=>{
    if(typeof window === "undefined") return;
    console.log(window.location.hash);
    fetch(`https://webapi-zu6v4azneq-el.a.run.app/get-courses-for-category?courseCategory=${courseCategory}`)
      .then((response) => response.json())
      .then((data) => {
        setCourses(data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, [
  ]);
  // function addResource() {

  // }
  return (
    <div className="content">
      <div className="header-content">
        <h1>
          Welcome to Chitti,{" "}
          <span
            style={{
              color: "#000000",
            }}
          >
            Admin
          </span>
        </h1>
        <input type="text" className="search-bar" placeholder="Search....." />
      </div>
      <div className="course-head">
        <div>
          <h4>{courseCategory?.toString()?.split("-").join(" ").toUpperCase()}</h4>
          <h3>Courses</h3>
        </div>
        <a href={"/" + courseCategory + "/add-course"}>Add Courses +</a>
      </div>
      <div className="courses">
        {(courses).map((r:any) => (
          <a className="course-block" href={"/" + courseCategory+"/course/" + r.courseId} key={r.courseId}>
            <div>
              <h3>{r.title}</h3>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
