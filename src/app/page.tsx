import { Card } from "antd";
import Link from "next/link";
import Title from "antd/es/typography/Title";
import { getServerSession } from "next-auth";

import { authOptions } from "@/1shared/auth";
import { ROUTE_PPR } from "@/1shared/lib/routes";
import { User, translateRuUserRole } from "@/2entities/user";
import { getManyPprsShortInfo, TMonthPprStatus, TYearPprStatus } from "@/2entities/ppr";
import { PprInfoTable } from "@/4widgets/pprShortInfoTable";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return null;
  }

  const user: User = session?.user;

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
    const { data } = await getManyPprsShortInfo({
      idDirection,
      idDistance,
      idSubdivision,
    });

    return (
      <main>
        <div>
          <b>id:</b> {id} <b>Роль:</b> {translateRuUserRole(role)} <b>Ф.И.О.:</b> {fullName}
        </div>
        {Boolean(data?.length) && (
          <Card className="overflow-auto">
            <Title level={2}>
              Планы технического обслуживания и ремонта {directionShortName} {distanceShortName} {subdivisionShortName}
            </Title>
            <PprInfoTable data={data || []} />
          </Card>
        )}
        {Boolean(!data?.length) && (
          <Card className="overflow-auto">
            <Title level={2}>Планы технического обслуживания и ремонта по {subdivisionShortName} отсутствуют.</Title>
            <Link href={ROUTE_PPR}>Перейти на страницу для создания плана ТОиР (в т.ч. на основе шаблона)</Link>
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
    ? (
        await getManyPprsShortInfo({
          idDirection,
          idDistance,
          idSubdivision,
          status: agreementYearStatus,
        })
      ).data || []
    : [];

  const monthPprsOnAgreement = agreementMonthStatuses
    ? (
        await getManyPprsShortInfo({
          idDirection,
          idDistance,
          idSubdivision,
          months_statuses: agreementMonthStatuses,
        })
      ).data || []
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
      {!yearsPprsOnAgreement.length && !monthPprsOnAgreement.length && (
        <Card className="overflow-auto">
          <Title level={2}>Планы технического обслуживания и ремонта на согласовании / утверждении отсутствуют</Title>
          <Link href={ROUTE_PPR}>Перейти на страницу планов ТОиР</Link>
        </Card>
      )}
    </main>
  );
}
