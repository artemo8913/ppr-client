"use client";
import { FC } from "react";
import Tabs from "antd/es/tabs";
import Modal from "antd/es/modal/Modal";
import { IWork } from "@/2entities/work";
import { WorkCreateForm } from "./WorkCreateForm";
import { WorkSelectTable } from "./WorkSelectTable";
import { useWorkModal } from "@/1shared/providers/workModalProvider";

interface IWorkModalProps extends React.ComponentProps<typeof Modal> {
  data: IWork[];
}

export const WorkModal: FC<IWorkModalProps> = ({ data }) => {
  const { closeModal, isOpen, indexToPlace: workIndex } = useWorkModal();
  return (
    <Modal title="Выберите работу" width={1024} open={isOpen} onCancel={closeModal} footer={null}>
      <Tabs
        defaultActiveKey="1"
        items={[
          {
            label: "Выбрать из перечня работ",
            key: "1",
            children: <WorkSelectTable data={data} onFinish={closeModal} indexToPlace={workIndex} />,
          },
          {
            label: "Добавить самостоятельно",
            key: "2",
            children: <WorkCreateForm onFinish={closeModal} indexToPlace={workIndex} />,
          },
        ]}
      />
    </Modal>
  );
};
