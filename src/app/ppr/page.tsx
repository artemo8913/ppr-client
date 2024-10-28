import Card from "antd/es/card/Card";

import { getManyPprsShortInfo, TPprShortInfo } from "@/2entities/ppr";
import { getAllDirections, getAllDistances, getAllSubdivision } from "@/2entities/division";
import { PprSearchQuery } from "@/3features/ppr/search";
import { PprInfoTable } from "@/4widgets/pprShortInfoTable";
import { CreatePprModal } from "@/4widgets/createPprModal";

interface IPprPageProps {
  searchParams: { [key in keyof TPprShortInfo]?: string };
}

export default async function PprPage({ searchParams }: IPprPageProps) {
  const [pprs, subdivisions, distances, directions] = await Promise.all([
    getManyPprsShortInfo({ ...searchParams }),
    getAllSubdivision(),
    getAllDistances(),
    getAllDirections(),
  ]).catch((e) => {
    throw new Error(`Load data for ppr info page error. ${e}`);
  });

  return (
    <Card size="small">
      <PprSearchQuery className="mb-4" divisions={{ subdivisions, distances, directions }} />
      <PprInfoTable data={pprs} />
      <CreatePprModal className="!block ml-auto" />
    </Card>
  );
}
