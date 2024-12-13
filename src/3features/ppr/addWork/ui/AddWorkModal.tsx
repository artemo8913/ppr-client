"use client";
import { FC } from "react";
import Tabs from "antd/es/tabs";
import Modal from "antd/es/modal/Modal";

import { usePpr } from "@/1shared/providers/pprProvider";
import { useWorkModal } from "@/1shared/providers/pprWorkModalProvider";
import { ICommonWork } from "@/2entities/commonWork";
import { IPprData, TWorkBranch } from "@/2entities/ppr";

import { CreateWorkForm } from "./CreateWorkForm";
import { SelectWorkTable } from "./SelectWorkTable";

const BRANCH_INITIAL_VALUE: TWorkBranch = "exploitation";

interface IWorkModalProps extends React.ComponentProps<typeof Modal> {
  data: ICommonWork[];
}

export const AddWorkModal: FC<IWorkModalProps> = ({ data }) => {
  const { closeAddWorkModal, isOpenAddWorkModal, workMeta } = useWorkModal();

  const {
    addWork,
    pprMeta: { subbranchesList },
  } = usePpr();

  const handleAddWork = (newWorkData: Partial<IPprData>) => {
    addWork(newWorkData, workMeta.id);
  };

  const subbranchOptions = subbranchesList?.map((subbranch) => {
    return { value: subbranch, label: subbranch };
  });

  const initialSubbranches = {
    branch: workMeta.branch || BRANCH_INITIAL_VALUE,
    subbranch: workMeta.subbranch ? workMeta.subbranch : "",
  };

  const initialValues = {
    ...initialSubbranches,
  };

  return (
    <Modal title="Выберите работу" width={1024} open={isOpenAddWorkModal} onCancel={closeAddWorkModal} footer={null}>
      <Tabs
        defaultActiveKey="1"
        items={[
          {
            label: "Выбрать из перечня работ",
            key: "1",
            children: (
              <SelectWorkTable
                data={data}
                onFinish={closeAddWorkModal}
                handleAddWork={handleAddWork}
                initialValues={initialSubbranches}
                subbranchOptions={subbranchOptions}
              />
            ),
          },
          {
            label: "Добавить самостоятельно",
            key: "2",
            children: (
              <CreateWorkForm
                onFinish={closeAddWorkModal}
                handleAddWork={handleAddWork}
                initialValues={initialValues}
                subbranchOptions={subbranchOptions}
              />
            ),
          },
        ]}
      />
    </Modal>
  );
};
