import { Card } from "antd";
import Title from "antd/es/typography/Title";
import { getServerSession } from "next-auth";

import { authOptions } from "@/1shared/auth/authConfig";
import { translateRuUserRole } from "@/1shared/locale/user";
import { IUser } from "@/2entities/user";
import { getManyPprsShortInfo, TMonthPprStatus, TYearPprStatus } from "@/2entities/ppr";
import { PprInfoTable } from "@/4widgets/pprShortInfoTable";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return null;
  }

  const user: IUser = session?.user;

  const {
    id,
    role,
    firstName,
    middleName,
    lastName,
    directionShortName,
    distanceShortName,
    subdivisionShortName,
    idDirection,
    idDistance,
    idSubdivision,
  } = user;

  const fullName = `${lastName} ${firstName[0]}.${middleName[0]}.`;

  if (role === "subdivision") {
    const pprs = await getManyPprsShortInfo({
      idDirection,
      idDistance,
      idSubdivision,
    });

    return (
      <main>
        <div>
          <b>id:</b> {id} <b>Роль:</b> {translateRuUserRole(role)} <b>Ф.И.О.:</b> {fullName}
        </div>
        {Boolean(pprs.length) && (
          <Card className="overflow-auto">
            <Title level={2}>
              Годовые планы {directionShortName} {distanceShortName} {subdivisionShortName}
            </Title>
            <PprInfoTable data={pprs} />
          </Card>
        )}
      </main>
    );
  }

  let agreementYearStatus: TYearPprStatus | undefined;
  let agreementMonthStatuses: TMonthPprStatus[] | undefined;

  if (role === "distance_engineer") {
    agreementYearStatus = "plan_on_agreement_engineer";
    agreementMonthStatuses = ["plan_on_agreement_engineer", "fact_verification_engineer"];
  } else if (role === "distance_time_norm") {
    agreementYearStatus = "plan_on_agreement_time_norm";
    agreementMonthStatuses = ["plan_on_agreement_time_norm", "fact_verification_time_norm"];
  } else if (role === "distance_sub_boss") {
    agreementYearStatus = "plan_on_agreement_sub_boss";
    agreementMonthStatuses = ["plan_on_aprove", "fact_on_agreement_sub_boss"];
  } else if (role === "distance_boss") {
    agreementYearStatus = "plan_on_aprove";
  }

  const yearsPprsOnAgreement = agreementYearStatus
    ? await getManyPprsShortInfo({
        idDirection,
        idDistance,
        idSubdivision,
        status: agreementYearStatus,
      })
    : [];

  const monthPprsOnAgreement = agreementMonthStatuses
    ? await getManyPprsShortInfo({
        idDirection,
        idDistance,
        idSubdivision,
        months_statuses: agreementMonthStatuses,
      })
    : [];

  return (
    <main className="flex flex-col gap-2">
      <div>
        id: {id} Дирекция: {directionShortName} Дистанция: {distanceShortName} Роль: {translateRuUserRole(role)} Ф.И.О.:{" "}
        {fullName}
      </div>
      {Boolean(yearsPprsOnAgreement.length) && (
        <Card className="overflow-auto">
          <Title level={2}>Годовые планы на согласовании / утверждении</Title>
          <PprInfoTable data={yearsPprsOnAgreement} />
        </Card>
      )}
      {Boolean(monthPprsOnAgreement.length) && (
        <Card className="overflow-auto">
          <Title level={2}>Месячные планы на согласовании / утверждении</Title>
          <PprInfoTable data={monthPprsOnAgreement} />
        </Card>
      )}
    </main>
  );
}
