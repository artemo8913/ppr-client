"use client";
import { FC, useCallback, useState } from "react";
import Tooltip from "antd/es/tooltip";
import Button from "antd/es/button";
import Modal from "antd/es/modal";
import { SettingOutlined } from "@ant-design/icons";
import { IPpr } from "@/2entities/ppr";
import { PprTableSaveButton } from "@/3features/ppr/update";
import { PprTableYearStatusUpdate, PprTableMonthStatusUpdate } from "@/3features/ppr/statusUpdate";
import { PprTableSelectTimePeriod } from "@/3features/pprTableSettings/selectTimePeriod";
import {
  PprTableSelectFilterPlanFact,
  PprTableSelectFilterTimePeriod,
} from "@/3features/pprTableSettings/selectColumnsFilter";
import { PprTableSelectCorrectionView } from "@/3features/pprTableSettings/selectCorrectionView";
import { PprTableSelectWidth } from "@/3features/pprTableSettings/selectWidth";
import { PprTableSelectFontSize } from "@/3features/pprTableSettings/selectFontSize";
import { PprTableSelectHeaderHeight } from "@/3features/pprTableSettings/selectHeaderHeight";

interface IPprTableControlPanelProps {
  pprData: IPpr;
}

export const PprTableControlPanel: FC<IPprTableControlPanelProps> = ({ pprData }) => {
  const [isOpen, setIsModalOpen] = useState(false);
  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  return (
    <div className="flex justify-start items-center sticky top-0 left-0 z-10 bg-slate-300">
      Статус: {pprData?.status} Создан: {new Date(pprData?.created_at!).toLocaleDateString()} Год: {pprData?.year}{" "}
      {pprData?.id_subdivision}-{pprData?.id_distance}-{pprData?.id_direction}
      <PprTableSaveButton />
      <PprTableYearStatusUpdate />
      <PprTableMonthStatusUpdate />
      <PprTableSelectTimePeriod />
      <>
        <Tooltip className="cursor-default" title="Настройки ППР">
          <Button icon={<SettingOutlined />} onClick={openModal} />
        </Tooltip>
        <Modal title="Настройки ППР" open={isOpen} onCancel={closeModal} footer={null}>
          <div className="flex justify-between items-center mb-4">
            <div>Отображаемый период времени: </div>
            <PprTableSelectFilterTimePeriod />
          </div>
          <div className="flex justify-between items-center mb-4">
            <div>Отображаемые столбцы планов и фактического выполнения работ: </div>
            <PprTableSelectFilterPlanFact />
          </div>
          <div className="flex justify-between items-center mb-4">
            <div>Общее отображение таблицы ППР: </div>
            <PprTableSelectCorrectionView />
          </div>
          <div className="flex justify-between items-center mb-4">
            <div>Ширина таблицы, %: </div>
            <PprTableSelectWidth />
          </div>
          <div className="flex justify-between items-center mb-4">
            <div>Высота заголовка, px: </div>
            <PprTableSelectHeaderHeight />
          </div>
          <div className="flex justify-between items-center mb-4">
            <div>Размер шрифта, px: </div>
            <PprTableSelectFontSize />
          </div>
        </Modal>
      </>
    </div>
  );
};
