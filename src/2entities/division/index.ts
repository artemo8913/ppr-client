export type { TDivisionType, TDirection, TDistance, TSubdivision } from "./model/division.type";
export type { IGetDivisionsResponce } from "./model/division.actions";

export {
  getAllDirections,
  getAllDistances,
  getAllSubdivision,
  getDirectionById,
  getDistanceById,
  getSubdivisionById,
  getDivisions,
  getDivisionsMap,
  getDivisionsById,
} from "./model/division.actions";
