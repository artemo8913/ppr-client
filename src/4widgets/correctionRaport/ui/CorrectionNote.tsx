"use client";
import React, { ChangeEvent, FC, useEffect, useState } from "react";
import TextArea from "antd/es/input/TextArea";

const NOTE_MAX_LENGTH = 2048;

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

  useEffect(() => {
    setNote(initialValue || "");
  }, [initialValue]);

  if (isEditable) {
    return (
      <TextArea
        placeholder="Введите примечание"
        allowClear
        showCount
        value={note}
        maxLength={NOTE_MAX_LENGTH}
        onBlur={handleBlurNote}
        onChange={handleChangeNote}
      />
    );
  }

  if (note) {
    return (
      <div>
        <p className="font-bold">Примечание:</p>
        <p className="whitespace-pre-wrap break-words">{note}</p>
      </div>
    );
  }

  return null;
};
