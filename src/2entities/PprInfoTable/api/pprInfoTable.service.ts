import { IPprInfo } from "../model/pprInfo.shema";

const PPR_API_URL = process.env.NEXT_PUBLIC_API_DEV + "/all_pprs";

export const pprInfoTableService = {
  async getPprs() {
    const query = await fetch(`${PPR_API_URL}`);
    const responce: Promise<IPprInfo[]> = query.json();
    return responce;
  },
};
