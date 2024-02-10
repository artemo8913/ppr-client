import { IPpr, PprTable } from "@/2entities/PprTable";

export default async function PprPageId() {
  const query = await fetch(process.env.NEXT_PUBLIC_API_DEV + "/pprs/draft");
  const { data, id, created_at, status}: IPpr = await query.json();

  return (
    <div className="w-full h-full overflow-scroll">
      ППРы с индексом
      <PprTable data={data} />
    </div>
  );
}
