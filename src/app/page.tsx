import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";
export default function Home() {
  // function addResource() {

  // }
  return (
    <div className="container">
      <div className="sidebar">
        <p className="logo">CHITTI.</p>
        <nav className="navbar">
          <h3>Resources</h3>
          <a href="#">University Core</a>
          <a href="#">Faculty Core</a>
          <a href="#">Program Core</a>
          <a href="#">Program Electives</a>
          <a href="#">Open Electives</a>
          <a href="#">Management Basket</a>

          <h3>Statistics</h3>
        </nav>
        {/* <button className="addcourse" onClick={() => addResource()}>Add Courses</button> */}
      </div>
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
            "Compile Design",
            "Artificial Intelligence",
            "Quantum computing",
          ].map((r) => (
            <div key={r}>
              <h3>{r}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
