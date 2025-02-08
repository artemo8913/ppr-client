"use client";
import React, { ChangeEvent, FC, useState } from "react";
import TextArea from "antd/es/input/TextArea";

interface ICorrectionNoteProps {
  initialValue?: string;
  isEditable?: boolean;
  handleBlur?: (note: string) => void;
}

export const CorrectionNote: FC<ICorrectionNoteProps> = ({ initialValue, handleBlur, isEditable }) => {
  const [note, setNote] = useState(initialValue || "");

  const handleChangeNote = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setNote(e.target.value);
  };

  const handleBlurNote = () => {
    if (handleBlur) {
      handleBlur(note);
    }
  };

  if (!isEditable) {
    return <pre className="font-[inherit]">{note}</pre>;
  }

  return (
    <TextArea
      placeholder="Введите примечание"
      allowClear
      showCount
      value={note}
      maxLength={256}
      onBlur={handleBlurNote}
      onChange={handleChangeNote}
    />
  );
};
