import Link from "next/link";
import Card from "antd/es/card/Card";
import Title from "antd/es/typography/Title";

export default function ReportsPage() {
  return (
    <Card>
      <Title level={2}>Отчеты</Title>
      <div className="flex flex-col">
        <Link href="reports/fulfillment">Выполнение работ</Link>
        <Link href="reports/laborCost">Трудозатраты</Link>
      </div>
    </Card>
  );
}
