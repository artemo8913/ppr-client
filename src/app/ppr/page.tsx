import Card from "antd/es/card/Card";
import { unstable_cache } from "next/cache";

import { getManyPprsShortInfo, TPprShortInfo } from "@/2entities/ppr";
import { getAllDirections, getAllDistances, getAllSubdivision } from "@/2entities/division";
import { PprSearchQuery } from "@/3features/ppr/search";
import { PprInfoTable } from "@/4widgets/pprShortInfoTable";
import { CreatePprModal } from "@/4widgets/createPprModal";

interface IPprPageProps {
  searchParams: { [key in keyof TPprShortInfo]?: string };
}

const getDivisions = unstable_cache(
  async () => {
    const [subdivisions, distances, directions] = await Promise.all([
      getAllSubdivision(),
      getAllDistances(),
      getAllDirections(),
    ]).catch((e) => {
      throw new Error(`Load divisions data for ppr info page error. ${e}`);
    });

    return { subdivisions, distances, directions };
  },
  ["divisions"],
  { revalidate: 3600, tags: ["divisions"] }
);

export default async function PprPage({ searchParams }: IPprPageProps) {
  const [pprs, divisions] = await Promise.all([getManyPprsShortInfo({ ...searchParams }), getDivisions()]).catch(
    (e) => {
      throw new Error(`Load data for ppr info page error. ${e}`);
    }
  );

  return (
    <Card size="small">
      <PprSearchQuery className="mb-4" divisions={divisions} />
      <PprInfoTable data={pprs} />
      <CreatePprModal className="!block ml-auto" />
    </Card>
  );
}
