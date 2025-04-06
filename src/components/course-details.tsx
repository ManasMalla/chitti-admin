/* eslint-disable  @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { usePathname } from "next/navigation";

import "tailwindcss/index.css";

export default function CourseDetails(props: any) {
  const courseCategory = usePathname().split("/")[1];
  const backUrl = `/${courseCategory}`;
  return (
    <>
      <div className="text-start p-8">
        <Link
          href={backUrl}
          className="inline-block mb-6 py-2 px-4 bg-gray-200 text-gray-700 rounded text-sm font-medium"
        >
          ← Back to Category
        </Link>
        <h2 className="text-3xl font-medium py-4">Course Description</h2>
        <p className="max-w-[48ch]">{props.description}</p>
        <div className="flex justify-between py-4 items-center">
          <h3 className="text-xl font-bold w-max">Units</h3>
          <a
            href={`/${courseCategory}/course/${props.courseId}/add-unit#${
              props.units.length + 1
            }`}
            className="bg-black text-white py-2 px-4 rounded-full uppercase text-sm"
          >
            Add unit
          </a>
        </div>
        {props.units.map((unit: any, index: number) => (
          <div key={index} className="unit">
            <h4 className="text-lg font-medium py-4">
              Unit {index + 1}: {unit.name}
            </h4>
            <p className="mb-8">{unit.description}</p>
            <div className="flex items-center  mb-4 gap-4">
              <h5 className="text-lg font-bold h-max">Topics</h5>
              <a
                href={`/${courseCategory}/course/${props.courseId}/${unit.name
                  .split(" ")
                  .join("-")
                  .toLowerCase()}/add-topic#${index + 1}.${
                  unit.topics.length + 1
                }`}
                className="border-black border-2 py-2 px-4 rounded-full text-sm uppercase"
              >
                Add topic
              </a>
            </div>
            <ul>
              {unit.topics.map((topic: any, index: number) => (
                <li className="list-disc ml-8 mb-2" key={index}>
                  <a
                    href={`/${courseCategory}/course/${
                      props.courseId
                    }/${unit.name.split(" ").join("-").toLowerCase()}/${
                      topic.id
                    }`}
                  >
                    {topic.name} {">"}
                  </a>
                </li>
              ))}
            </ul>
            <div className="flex items-center  mb-4 gap-4">
              <h5 className="text-lg font-bold h-max">Important Questions</h5>
              <a
                href="#"
                className="border-orange-500 text-orange-500 border-2 py-2 px-4 rounded-full text-sm uppercase"
              >
                Add question
              </a>
            </div>
            <hr className="h-1 mx-auto my-10 bg-orange-200 border-0 rounded-sm" />
          </div>
        ))}
      </div>
    </>
  );
}
