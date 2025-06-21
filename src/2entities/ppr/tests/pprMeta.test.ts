import { createNewPprWorkInstance } from "../lib/createNewPprWorkInstance";
import { createNewWorkingManInstance } from "../lib/createNewWorkingManInstance";
import { createPprMeta, IBranchDefaultMeta, IBranchMeta, IPprMeta } from "../lib/createPprMeta";
import { TTotalFieldsValues } from "../model/ppr.types";

describe("createPprMeta", () => {
  it("createPprMeta возвращает объект нужного типа", () => {
    const pprData = [createNewPprWorkInstance({})];

    const workingMansData = [createNewWorkingManInstance()];

    const result = createPprMeta({ pprData, workingMansData });
    expect(result).toEqual<IPprMeta>({
      totalValues: {
        final: expect.any(Object),
        original: expect.any(Object),
      },
      worksRowSpan: expect.any(Array),
      branchesMeta: expect.any(Array),
      worksOrderForRowSpan: expect.any(Object),
      branchesAndSubbrunchesOrder: expect.any(Object),
      subbranchesList: expect.any(Array),
    });
  });
  it("pprMeta ведет расчет", () => {
    const pprData = [
      createNewPprWorkInstance({
        branch: "exploitation",
        subbranch: "subbranch",
        year_plan_time: { final: 1, original: 1 },
        jan_plan_time: { final: 1, original: 1 },
        year_fact_time: 1,
        jan_fact_time: 1,
      }),
    ];

    const workingMansData = [createNewWorkingManInstance()];

    const result = createPprMeta({ pprData, workingMansData });

    const totalShoudBe = {
      peoples: {},
      works: { year_plan_time: 1, jan_plan_time: 1, year_fact_time: 1, jan_fact_time: 1 },
    };

    const subbranchShouldBe: IBranchDefaultMeta = {
      name: "subbranch",
      orderIndex: "1.1.",
      prev: null,
      total: {
        final: {
          jan_fact_time: 1,
          jan_plan_time: 1,
          year_fact_time: 1,
          year_plan_time: 1,
        },
        original: {
          jan_fact_time: 1,
          jan_plan_time: 1,
          year_fact_time: 1,
          year_plan_time: 1,
        },
      },
      type: "subbranch",
      workIds: new Set([pprData[0].id]),
    };

    const branchShouldBe: IBranchMeta = {
      name: "exploitation",
      orderIndex: "1.",
      prev: null,
      total: { final: totalShoudBe.works, original: totalShoudBe.works },
      subbranches: [subbranchShouldBe],
      type: "branch",
      workIds: new Set([pprData[0].id]),
    };

    expect(result).toMatchObject<IPprMeta>({
      totalValues: {
        final: totalShoudBe,
        original: totalShoudBe,
      },
      worksRowSpan: [1],
      branchesMeta: [branchShouldBe],
      worksOrderForRowSpan: { [pprData[0].id]: "1.1.1" },
      branchesAndSubbrunchesOrder: { [pprData[0].id]: { branch: branchShouldBe, subbranch: subbranchShouldBe } },
      subbranchesList: ["subbranch"],
    });
  });
});
