/* eslint-disable  @typescript-eslint/no-explicit-any */
import { usePathname } from "next/navigation";

import "tailwindcss/index.css";

export default function CourseDetails(props: any) {
  const courseCategory = usePathname().split("/")[1];
  return (
    <>
      <div className="text-start p-8">
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
          </div>
        ))}
      </div>
    </>
  );
}
