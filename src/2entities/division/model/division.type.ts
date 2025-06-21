import { directionsTable, distancesTable, subdivisionsTable } from "./division.schema";

export type DivisionType = "transenergo" | "direction" | "distance" | "subdivision";

export type Direction = typeof directionsTable.$inferSelect;

export type Distance = typeof distancesTable.$inferSelect;

export type Subdivision = typeof subdivisionsTable.$inferSelect;
