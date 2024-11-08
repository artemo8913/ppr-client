"use client";
import { FC, useCallback, useState } from "react";
import Button from "antd/es/button";
import Tooltip from "antd/es/tooltip";
import { CopyTwoTone } from "@ant-design/icons";
import Modal from "antd/es/modal/Modal";

import { PprCopyForm } from "./PprCopyForm";

interface IPprCopyButtonProps {
  pprId: number;
}

export const PprCopyButton: FC<IPprCopyButtonProps> = (props) => {
  const [isOpen, setIsModalOpen] = useState(false);

  const openModal = useCallback(() => setIsModalOpen(true), []);

  const closeModal = useCallback(() => setIsModalOpen(false), []);

  return (
    <Tooltip title="Копировать">
      <Button icon={<CopyTwoTone className="cursor-pointer" />} onClick={openModal} />
      <Modal title="Копировать годовой план" width={1024} open={isOpen} onCancel={closeModal} footer={null}>
        <PprCopyForm pprId={props.pprId} />
      </Modal>
    </Tooltip>
  );
};
