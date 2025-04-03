"use client";
import { useParams } from "next/navigation";
import "tailwindcss/index.css";

export default function Page() {
  const topicId = useParams().topicId;
  return (
    <div className="p-8 overflow-scroll grow">
      <p className="uppercase font-bold opacity-50">
        {topicId?.toString().split("-").join(" ")}
      </p>
      <h2 className="text-4xl mb-2">Resources</h2>
      <h4 className="text-lg font-medium mt-8">Videos</h4>
      <ul className="mt-4">
        {["Dummy Video", "Lorem ipsum"].map((video: string) => (
          <li className="list-disc ml-8 mb-2" key={video}>
            <div className="flex gap-4">
              <a href={`https://www.youtube.com/watch?v=${video}`}>{video}</a>
              <span className="material-symbols-outlined cursor-pointer">
                edit
              </span>
              <span className="material-symbols-outlined cursor-pointer">
                delete
              </span>
            </div>
          </li>
        ))}
      </ul>
      <h4 className="text-lg font-medium mt-8">Important Questions</h4>
      <ul className="mt-4">
        {[1, 2, 3].map((question: number) => (
          <li className="list-disc ml-8 mb-2" key={question}>
            <a href={`https://www.youtube.com/watch?v=${question}`}>
              Question {question} {">"}
            </a>
          </li>
        ))}
      </ul>
      <h4 className="text-lg font-medium mt-8">Notes</h4>
      <ul className="mt-4">
        {[1, 2, 3].map((note: number) => (
          <li className="list-disc ml-8 mb-2" key={note}>
            <a href={`https://www.youtube.com/watch?v=${note}`}>
              Note {note} {">"}
            </a>
          </li>
        ))}
      </ul>
      <h4 className="text-lg font-medium mt-8">Cheatsheets</h4>
      <ul className="mt-4">
        {[1, 2, 3].map((cheatsheet: number) => (
          <li className="list-disc ml-8 mb-2" key={cheatsheet}>
            <a href={`https://www.youtube.com/watch?v=${cheatsheet}`}>
              Cheatsheet {cheatsheet} {">"}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
