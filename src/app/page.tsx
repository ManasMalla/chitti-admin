// import Image from "next/image";
// import styles from "./page.module.css";
// import Link from "next/link";

export default function Home() {
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
        <h3>Courses</h3>
        <button type="button">Add Courses +</button>
      </div>
      <div className="courses">
        {[
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
        ].map((r) => (
          <a className="course-block" href={"/course/" + r.id} key={r.id}>
            <div>
              <h3>{r.name}</h3>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
