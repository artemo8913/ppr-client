"use client";
import { FC, useCallback, useState } from "react";
import Button from "antd/es/button";
import Modal from "antd/es/modal/Modal";
import { CreatePprForm } from "./CreatePprForm";

interface ICreatePprModalProps extends React.ComponentProps<typeof Modal> {}

export const CreatePprModal: FC<ICreatePprModalProps> = () => {
  const [isOpen, setIsModalOpen] = useState(false);
  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  return (
    <>
      <Button type="primary" onClick={openModal}>
        Добавить
      </Button>
      <Modal title="Выберите работу" width={1024} open={isOpen} onCancel={closeModal} footer={null}>
        <CreatePprForm onFinish={closeModal} />
      </Modal>
    </>
  );
};
