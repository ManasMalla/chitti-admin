import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";

export default function Home() {

    function addResource() {
        
    }

    return (
        <div className="container">
            <div className="sidebar">
                <img src="/images/chitti.png" id="im1" />
                <div className="navbar">
                    <h3>Resources</h3>
                    <a href="#">University Core</a>
                    <a href="#">Faculty Core</a>
                    <a href="#">Program Core</a>
                    <a href="#">Program Electives</a>
                    <a href="#">Open Electives</a>
                    <a href="#">Management Basket</a>
                </div>
                <div className="dashboard">
                    <h3>Dashboard</h3>
                    <a href="#">Statistics</a>
                </div>a
                <button className="addcourse" onClick={() => addResource()}>Add Courses</button>
            </div>
            <div className="content">
                <div className="header-content">
                    <h1>Welcome to Chitti Admin Panel</h1>
                    <input type="text" className="search-bar" />
                </div>
                <div className="course-head">
                    <h3>Courses</h3>
                </div>
                <div className="courses">
                    <div><h3>Compiler Design</h3></div>
                    <div><h3>Computer Networks</h3></div>
                    <div><h3>WAD</h3></div>
                    <div><h3>Artifial Intelligence</h3></div>
                    <div><h3>Engineering Economics</h3></div>
                    <div><h3>Quantum</h3></div>
                    <div><h3>Agile</h3></div>
                    <div><h3>Cloud</h3></div>
                    <div><h3>Image Processing</h3></div>
                </div>
            </div>
        </div>
    );
}
