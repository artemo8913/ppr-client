import { commonWorksTable } from "./commonWork.schema";

export type CommonWork = typeof commonWorksTable.$inferSelect;
