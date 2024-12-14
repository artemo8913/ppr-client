import React, { useCallback, useState } from "react";
import Tooltip from "antd/es/tooltip";
import Button from "antd/es/button";
import Modal from "antd/es/modal";
import { SettingOutlined } from "@ant-design/icons";

import {
  PprTableSelectFilterPlanFact,
  PprTableSelectFilterTimePeriod,
  PprTableBacklightCommonWork,
  PprTableCombineSameWork,
  PprTableSelectCorrectionView,
  PprTableSelectFontSize,
  PprTableSelectHeaderHeight,
  PprTableSelectWidth,
} from "@/3features/pprTableSettings";

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
        <div className="flex justify-between items-center mb-4">
          <div>Подсветить работы, добавленные самостоятельно</div>
          <PprTableBacklightCommonWork />
        </div>
        <div className="flex justify-between items-center mb-4">
          <div>Подсвечивать строку при наведении курсора</div>
          {/* <PprTableBacklightCommonWork /> */}
        </div>
        <div className="flex justify-between items-center">
          <div>Объединять работы с одинаковым наименованием</div>
          <PprTableCombineSameWork />
        </div>
      </Modal>
    </>
  );
}
