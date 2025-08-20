/* eslint-disable  @typescript-eslint/no-explicit-any */
"use client";
import { useParams } from "next/navigation";
// import Image from "next/image";
// import styles from "./page.module.css";
// import Link from "next/link";

import { useEffect, useState } from "react";
import { getCookie } from "cookies-next/client";
import { BASE_URL } from "@/lib/constants";

export default function Home() {
  const { courseCategory } = useParams();
  const [courses, setCourses] = useState<any>([]);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const token = getCookie("idToken");
    const currentToken = new Date().getTime() / 1000;
    if (
      token === undefined ||
      currentToken > JSON.parse(atob((token || "").split(".")[1])).exp
    ) {
      alert("Token expired.");
      window.location.href = "/";
    }
    fetch(
      `${BASE_URL}/admin/get-courses-for-category?courseCategory=${courseCategory}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        redirect: "follow",
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setCourses(data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, [courseCategory]);
  // function addResource() {

  // }
  return (
    <div className="content">
      <div className="course-head">
        <div>
          <h4>
            {courseCategory?.toString()?.split("-").join(" ").toUpperCase()}
          </h4>
          <h3>Courses</h3>
        </div>
        <a
          href={"/" + courseCategory + "/add-course"}
          style={{
            textDecoration: "none",
          }}
        >
          Add Courses +
        </a>
      </div>
      <div className="courses">
        {courses.map((r: any) => (
          <a
            className="course-block"
            href={"/" + courseCategory + "/course/" + r.courseId}
            key={r.courseId}
          >
            <div>
              <img src={r.image} alt={r.title} />
              <h3>
                {r.title
                  .split(" ")
                  .map(
                    (e: string) =>
                      e[0].toUpperCase() + e.substring(1).toLowerCase()
                  )
                  .join(" ")}
              </h3>
              <p>{r.description}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
