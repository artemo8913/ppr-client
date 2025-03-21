"use client";
import Button from "antd/es/button";
import Modal from "antd/es/modal/Modal";
import { FC, useCallback, useState } from "react";

import { CreatePprForm } from "./CreatePprForm";

interface ICreatePprModalProps {
  className?: string;
}

export const CreatePprModal: FC<ICreatePprModalProps> = (props) => {
  const [isOpen, setIsModalOpen] = useState(false);

  const openModal = useCallback(() => setIsModalOpen(true), []);

  const closeModal = useCallback(() => setIsModalOpen(false), []);

  return (
    <>
      <Button className={props.className} type="primary" onClick={openModal}>
        Создать ЭУ-132
      </Button>
      <Modal
        title="Создать план технического обслуживания и ремонта"
        width={1024}
        open={isOpen}
        onCancel={closeModal}
        footer={null}
      >
        <CreatePprForm onFinish={closeModal} />
      </Modal>
    </>
  );
};
