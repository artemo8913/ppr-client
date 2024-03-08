"use client";
import { FC, useState } from "react";
import Tabs from "antd/es/tabs";
import Modal from "antd/es/modal/Modal";
import Button from "antd/es/button";
import { WorkCreateForm } from "./WorkCreateForm";
import { IWork } from "@/1shared/api/work";
import { WorkSelect } from "./WorkSelect";

interface IWorkModalProps extends React.ComponentProps<typeof Modal> {
  data: IWork[];
}

export const WorkModal: FC<IWorkModalProps> = ({ data }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };
  const hideModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Open Modal
      </Button>
      <Modal title="Выберите работу" width={1024} open={isModalOpen} onCancel={hideModal} footer={null}>
        <Tabs
          defaultActiveKey="1"
          items={[
            {
              label: "Выбрать из перечня работ",
              key: "1",
              children: <WorkSelect data={data} onFinish={hideModal} />,
            },
            {
              label: "Добавить самостоятельно",
              key: "2",
              children: <WorkCreateForm onFinish={hideModal} />,
            },
          ]}
        />
      </Modal>
    </>
  );
};
