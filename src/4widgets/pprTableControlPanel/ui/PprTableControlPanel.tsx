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
import { PprTableSetOneUnityButton } from "@/3features/ppr/setOneUnity";
import { PprTableCombineSameWork } from "@/3features/pprTableSettings/combineWorkWithSameName";

interface IPprTableControlPanelProps {
  ppr: IPpr;
}

export const PprTableControlPanel: FC<IPprTableControlPanelProps> = ({ ppr }) => {
  const [isOpen, setIsModalOpen] = useState(false);
  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  return (
    <div className="flex justify-start items-center sticky top-0 left-0 z-10 bg-slate-300 overflow-hidden">
      Статус: {ppr?.status} Создан: {new Date(ppr?.created_at!).toLocaleDateString()} Год: {ppr?.year}{" "}
      {ppr?.id_subdivision}-{ppr?.id_distance}-{ppr?.id_direction}
      <PprTableSaveButton />
      <PprTableYearStatusUpdate />
      <PprTableMonthStatusUpdate />
      <PprTableSelectTimePeriod />
      <PprTableSetOneUnityButton />
      <>
        <Tooltip className="cursor-default" title="Настройки отображения ППР">
          <Button icon={<SettingOutlined />} type="text" shape="circle" onClick={openModal} />
        </Tooltip>
        <Modal title="Настройки отображения ППР" open={isOpen} onCancel={closeModal} footer={null}>
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
          <div className="flex justify-start gap-2">
            <div>Объединять работы с одинаковым наименованием (без возможности добавлять/удалять работы) </div>
            <PprTableCombineSameWork />
          </div>
        </Modal>
      </>
    </div>
  );
};
