import React, { useCallback, useState } from "react";
import Tooltip from "antd/es/tooltip";
import Button from "antd/es/button";
import Modal from "antd/es/modal";
import { SettingOutlined } from "@ant-design/icons";

import {
  PprTableSelectFilterPlanFact,
  PprTableSelectFilterTimePeriod,
} from "@/3features/pprTableSettings/selectColumnsFilter";
import { PprTableSelectCorrectionView } from "@/3features/pprTableSettings/selectCorrectionView";
import { PprTableSelectWidth } from "@/3features/pprTableSettings/selectWidth";
import { PprTableSelectFontSize } from "@/3features/pprTableSettings/selectFontSize";
import { PprTableSelectHeaderHeight } from "@/3features/pprTableSettings/selectHeaderHeight";
import { PprTableCombineSameWork } from "@/3features/pprTableSettings/combineWorkWithSameName";

export default function PprTableSettingsModal() {
  const [isOpen, setIsModalOpen] = useState(false);

  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  return (
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
        <div className="flex justify-start gap-2 text-gray-400 cursor-not-allowed">
          <div>Объединять работы с одинаковым наименованием (без возможности добавлять/удалять работы) </div>
          <PprTableCombineSameWork />
        </div>
      </Modal>
    </>
  );
}
