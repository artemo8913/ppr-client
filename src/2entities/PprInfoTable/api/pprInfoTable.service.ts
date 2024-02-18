import { getServerSession } from "next-auth";
import { IPprInfo } from "../model/pprInfo.shema";
import { authOptions } from "@/1shared/auth/authConfig";

const PPR_API_URL = process.env.NEXT_PUBLIC_API_DEV + "/all_pprs";

export const pprInfoTableService = {
  async getPprs() {
    'use server'
    const query = await fetch(`${PPR_API_URL}`);
    const responce: Promise<IPprInfo[]> = query.json();
    return responce;
  },
};
