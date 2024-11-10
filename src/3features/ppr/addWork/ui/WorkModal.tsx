"use client";
import { FC } from "react";
import Tabs from "antd/es/tabs";
import Modal from "antd/es/modal/Modal";

import { useWorkModal } from "@/1shared/providers/workModalProvider";
import { ICommonWork } from "@/2entities/commonWork";

import { WorkCreateForm } from "./WorkCreateForm";
import { WorkSelectTable } from "./WorkSelectTable";

interface IWorkModalProps extends React.ComponentProps<typeof Modal> {
  data: ICommonWork[];
}

export const WorkModal: FC<IWorkModalProps> = ({ data }) => {
  const { closeModal, isOpen, nearWorkId: workId } = useWorkModal();
  return (
    <Modal title="Выберите работу" width={1024} open={isOpen} onCancel={closeModal} footer={null}>
      <Tabs
        defaultActiveKey="1"
        items={[
          {
            label: "Выбрать из перечня работ",
            key: "1",
            children: <WorkSelectTable data={data} onFinish={closeModal} nearWorkIdToPlaceNewWork={workId} />,
          },
          {
            label: "Добавить самостоятельно",
            key: "2",
            children: <WorkCreateForm onFinish={closeModal} nearWorkId={workId} />,
          },
        ]}
      />
    </Modal>
  );
};
