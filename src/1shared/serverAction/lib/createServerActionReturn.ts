"use server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/1shared/auth/authConfig";
import { TNotification } from "@/1shared/notification";

import { IServerActionReturn } from "../model/serverAction.types";

interface IReturnFunctionArgs<DataType = undefined> {
  message: string;
  data?: DataType;
  code?: number;
}

async function serverActionLog(type: TNotification, message: string) {
  const session = await getServerSession(authOptions);
  const startMessage = `${type}: ${new Date().toLocaleString()} ${message}`;

  if (!session) {
    console.log(`${startMessage} user = null`);
    return;
  }

  const user = session.user;

  console.log(`${startMessage} user id=${user.id} ${user.lastName}`);
}

export async function returnSuccess<DataType = undefined>({
  data,
  message,
}: IReturnFunctionArgs<DataType>): Promise<IServerActionReturn<DataType>> {
  await serverActionLog("success", message);

  return {
    data,
    message,
    code: 200,
    type: "success",
  };
}

export async function returnError<DataType = undefined>({
  data,
  message,
  code,
}: IReturnFunctionArgs<DataType>): Promise<IServerActionReturn<DataType>> {
  await serverActionLog("error", message);

  return {
    data,
    message,
    code: code || 500,
    type: "error",
  };
}
