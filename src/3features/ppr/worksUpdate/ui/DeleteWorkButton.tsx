"use client";
import { FC, memo, useCallback } from "react";
import Button from "antd/es/button";
import { MinusOutlined } from "@ant-design/icons";
import { usePpr } from "@/1shared/providers/pprProvider";

interface IDeleteWorkButtonProps extends React.ComponentProps<typeof Button> {
  workId?: string;
}

const DeleteWorkButton: FC<IDeleteWorkButtonProps> = ({ workId }) => {
  const { deleteWork } = usePpr();

  const handleClick = useCallback(() => {
    workId && deleteWork(workId);
  }, [deleteWork, workId]);

  return <Button onClick={handleClick} size="small" shape="circle" icon={<MinusOutlined />} />;
};

const DeleteWorkButtonMemo = memo(DeleteWorkButton);

export { DeleteWorkButtonMemo as DeleteWorkButton };
