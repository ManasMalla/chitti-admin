import Image from "next/image";
import styles from "./page.module.css";

export default function Home() 
{
    return(
        <div>
     <div className="sidebar">
      <img src="public/images/gitam.png"></img>
             <details>
            <summary>SEM 1</summary>
            <div className="submenu">
                <a href="#">SUBJECt1</a>
                <a href="#">subject2</a>
                <a href="#">subject3</a>
            </div>
        </details>
        <details>
            <summary>SEM 2</summary>
            <div className="submenu">
                <a href="#">SUBJECt1</a>
                <a href="#">subject2</a>
                <a href="#">subject3</a>
            </div>
        </details>
        <details>
            <summary>SEM 3</summary>
            <div className="submenu">
                <a href="#">SUBJECt1</a>
                <a href="#">subject2</a>
                <a href="#">subject3</a>
            </div>
        </details>
        <details>
            <summary>SEM 4</summary>
            <div className="submenu">
                <a href="#">SUBJECt1</a>
                <a href="#">subject2</a>
                <a href="#">subject3</a>
            </div>
        </details>
        <details>
            <summary>SEM 5</summary>
            <div className="submenu">
                <a href="#">SUBJECt1</a>
                <a href="#">subject2</a>
                <a href="#">subject3</a>
            </div>
        </details>
        <details>
            <summary>SEM 6</summary>
            <div className="submenu">
                <a href="#">SUBJECt1</a>
                <a href="#">subject2</a>
                <a href="#">subject3</a>
            </div>
        </details>
        <details>
            <summary>SEM 7</summary>
            <div className="submenu">
                <a href="#">SUBJECt1</a>
                <a href="#">subject2</a>
                <a href="#">subject3</a>
            </div>
        </details>
        <details>
            <summary>SEM 8</summary>
            <div className="submenu">
                <a href="#">SUBJECt1</a>
                <a href="#">subject2</a>
                <a href="#">subject3</a>
            </div>
        </details>
    </div>
    <div className="content">
        <h2>Welcome to CHITTI !</h2>
        <p>YOUR PARTNER IN CRIME BUAHAHAHAH !!</p>
    </div>
        </div>
    );
   
}
