import { useParams } from "next/navigation";

export default function Page() {
  const topicId = useParams().topicId;
  return (
    <div>
      <p>Resources for Chitti</p>
      <p>{topicId}</p>
    </div>
  );
}
