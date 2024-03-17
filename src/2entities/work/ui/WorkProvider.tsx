import { getAllWorks } from "@/1shared/api/work";
import { WorkModal } from "..";

export const WorkProvider = async () => {
  const works = await getAllWorks();
  return <WorkModal data={works} />;
}
