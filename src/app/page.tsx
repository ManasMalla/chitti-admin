    import Image from "next/image";
    import styles from "./page.module.css";
    import Link from "next/link";

    export default function Home() {
        return (
            <div className="container">
                {/* Sidebar */}
                <div className="sidebar">
                    <img src="/images/chitti.png" id="im1" />
                    
                    <div className="navbar">
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
                    </div>
                    <button className="addcourse">Add Courses</button>
                </div>
                <div className="content">
                    <h1>Welcome to Chitti Admin Panel</h1>
                </div>
            </div>
        );
    }
