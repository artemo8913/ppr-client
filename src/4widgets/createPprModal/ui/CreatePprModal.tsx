"use client";
import { FC } from "react";
import Modal from "antd/es/modal/Modal";
import { IWork } from "@/2entities/work";
import { useModal } from "@/1shared/providers/modalProvider";
import { CreatePprForm } from "./CreatePprForm";
import Button from "antd/es/button";

interface ICreatePprModalProps extends React.ComponentProps<typeof Modal> {}

export const CreatePprModal: FC<ICreatePprModalProps> = () => {
  const { openModal, closeModal, isOpen } = useModal();

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
