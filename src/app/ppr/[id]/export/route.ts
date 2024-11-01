import { NextRequest, NextResponse } from "next/server";

import { getPprTable } from "@/2entities/ppr";
import { pprConvertToXlsx } from "@/3features/ppr/convertToXlsx";

interface IParams {
  params: { id?: string };
}

export async function GET(_request: NextRequest, { params }: IParams) {
  try {
    if (isNaN(Number(params?.id))) {
      throw new Error(`Ppr id not provided`);
    }

    const ppr = await getPprTable(Number(params?.id));

    const workbook = await pprConvertToXlsx(ppr);

    const buffer = await workbook.xlsx.writeBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="PPR ${ppr.year}-${ppr.idDirection}-${ppr.idDistance}-${ppr.idSubdivision}.xlsx"`,
      },
    });
  } catch (e) {
    return new NextResponse(`Ppr export error. ${e}`, { status: 400 });
  }
}
