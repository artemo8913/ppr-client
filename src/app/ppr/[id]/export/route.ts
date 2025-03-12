import { NextRequest, NextResponse } from "next/server";

import { transliterateRuToEn } from "@/1shared/lib/locale/transliterateRuToEn";
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

    const { data: ppr } = await getPprTable(Number(params?.id));

    if (!ppr) {
      throw new Error(`Ppr with id=${params?.id} not exist`);
    }

    const workbook = await pprConvertToXlsx(ppr);

    const buffer = await workbook.xlsx.writeBuffer();

    const date = new Date().toLocaleDateString("ru");

    const fileName = `1203_${transliterateRuToEn(ppr.subdivisionShortName || "")}_${ppr.year}_P ${date}`;

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${fileName}.xlsx"`,
      },
    });
  } catch (e) {
    return new NextResponse(`Ppr export error. ${e}`, { status: 400 });
  }
}
