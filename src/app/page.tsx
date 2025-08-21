"use client";
// import Image from "next/image";
import styles from "./page.module.css";
import "tailwindcss/index.css";
import { FormEvent, useEffect, useState } from "react";
import app from "@/lib/firebase";
import { getAuth, signInWithCustomToken, User } from "@firebase/auth";
import { useRouter } from "next/navigation";
import { getCookie, setCookie } from "cookies-next/client";
import Link from "next/link";
import {BASE_URL} from "@/lib/constants";
// import Link from "next/link";

export default function Home() {
  const [isSignedIn, setSignedInStatus] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const token = getCookie("idToken");
    const currentToken = new Date().getTime() / 1000;
    if (
      token === undefined ||
      currentToken > JSON.parse(atob((token || "").split(".")[1])).exp
    ) {
      setSignedInStatus(false);
    } else {
      setSignedInStatus(true);
      getAuth(app).onAuthStateChanged((user) => {
        setUser(user);
      });
    }
  }, []);
  const router = useRouter();
  return (
    <>
      {isSignedIn ? (
        <main>
          <div className="w-full h-full flex p-12 gap-12">
            <img
              className="rounded-xl"
              src="https://w0.peakpx.com/wallpaper/400/821/HD-wallpaper-aesthetic-study-laptop-study.jpg"
              alt={"Image of a study table"}
            />
            <div className="flex flex-col max-w-[480px] grow">
              <p className="text-xl font-bold text-[var(--primary)] mb-12 ">
                CHITTI.
              </p>
              <h1 className="text-5xl mb-4">
                Welcome,
                <br />
                Admin.
              </h1>
              <div className="flex flex-row-reverse w-max p-2 px-3 border-2 border-black rounded-full items-center gap-2">
                <h2>{user?.uid || "Loading.."}</h2>
                <img
                  src={user?.photoURL || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
                  className="size-6 object-cover object-top rounded-full"
                />
              </div>
              <Link
                href="/program-core"
                className="bg-black py-3 px-6 text-white rounded-full cursor-pointer mt-auto flex items-center gap-2 border border-black dark:border-white"
              >
                Continue to admin panel{" "}
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
            </div>
          </div>
        </main>
      ) : (
        <main className="w-full h-full flex p-12 gap-12">
          <img
            className="rounded-xl"
            src="https://w0.peakpx.com/wallpaper/400/821/HD-wallpaper-aesthetic-study-laptop-study.jpg"
            alt={"Image of a study table"}
          />
          <div className="flex flex-col gap-12 max-w-[480px] grow">
            <p className="text-xl font-bold text-[var(--primary)]">CHITTI.</p>
            <h1 className="text-5xl">
              Welcome,
              <br />
              Admin.
            </h1>
            <form
              onSubmit={(e: FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const rollNumber = formData.get("rollNo");
                const password = formData.get("password");
                const auth = getAuth(app);
                fetch(`${BASE_URL}/admin/login`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  redirect: "follow",
                  body: JSON.stringify({
                    rollNo: rollNumber,
                    pass: password,
                  }),
                }).then(async (response: Response) => {
                  if (response.status === 200) {
                    const token: string = (await response.json()).token;
                    const userCredential = await signInWithCustomToken(
                      auth,
                      token
                    );
                    const refreshToken = await userCredential.user.getIdToken();
                    setCookie("idToken", refreshToken, {
                      secure: true,
                      maxAge: 3600,
                    });
                    router.push("/program-core");
                  } else {
                    alert((await response.json()).message);
                  }
                });
              }}
            >
              <div className={styles["login-section"]}>
                <input name="rollNo" placeholder="Roll Number" />
                <input name="password" type="password" placeholder="Password" />
                <button className="bg-black py-3 px-8 text-white rounded-full cursor-pointer dark:bg-white dark:text-black">
                  Login
                </button>
              </div>
            </form>
            <div className="grow" />
            <p className="text-gray-600 dark:text-gray-300">
              © 2025 <span className="font-medium text-black dark:text-white">theananta</span>.
              All Rights Reserved.
            </p>
          </div>
        </main>
      )}
    </>
  );
}
