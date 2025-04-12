"use client";
// import Image from "next/image";
import styles from "./page.module.css";
import "tailwindcss/index.css";
import {FormEvent} from "react";
import app from "@/lib/firebase";
import {getAuth, signInWithCustomToken} from "@firebase/auth";
import {useRouter} from "next/navigation";
import {setCookie} from "cookies-next/client";
// import Link from "next/link";

export default function Home() {
  const router = useRouter();
  return (
    <main className="w-full h-full flex p-12 gap-12">
      <img
        className="rounded-xl"
        src="https://w0.peakpx.com/wallpaper/400/821/HD-wallpaper-aesthetic-study-laptop-study.jpg"
       alt={"Image of a study table"}/>
      <div className="flex flex-col gap-12 max-w-[480px] grow">
        <p className="text-xl font-bold text-[var(--primary)]">CHITTI.</p>
        <h1 className="text-5xl">
          Welcome,
          <br />
          Admin.
        </h1>
        <form onSubmit={(e: FormEvent<HTMLFormElement>)=>{
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const rollNumber = formData.get("rollNo");
          const password = formData.get("password");
          const auth = getAuth(app);
          fetch("https://webapi-zu6v4azneq-el.a.run.app/admin-login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            redirect: "follow",
            body: JSON.stringify({
              rollNo: rollNumber,
              pass: password
            })
          }).then(async (response: Response)=>{
            if(response.status === 200){
              const token: string = (await response.json()).token;
              const userCredential = await signInWithCustomToken(auth, token);
              const refreshToken = await userCredential.user.getIdToken();
              setCookie('idToken', refreshToken, {
                secure: true, maxAge: 3600
              });
              router.push("/program-core");
            }else{
              alert((await response.json()).message);
            }
          });
        }}>
          <div className={styles["login-section"]}>
            <input name="rollNo" placeholder="Roll Number"/>
            <input name="password" type="password" placeholder="Password"/>
            <button className="bg-black py-3 px-8 text-white rounded-full">Login</button>
          </div>
        </form>
        <div className="grow"/>
        <p className="text-gray-600">© 2025 <span className="font-medium text-black">theananta</span>. All Rights Reserved.</p>
      </div>
    </main>
  );
}
