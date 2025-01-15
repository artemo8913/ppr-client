import Card from "antd/es/card/Card";
import Link from "antd/es/typography/Link";
import Title from "antd/es/typography/Title";

export default function ReportsPage() {
  return (
    <Card>
      <Title level={2}>Отчеты</Title>
      <Link href="reports/fulfillment">Выполнение работ</Link>
    </Card>
  );
}
