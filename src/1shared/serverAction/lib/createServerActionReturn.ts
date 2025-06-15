"use server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/1shared/auth";
import { NotificationType } from "@/1shared/notification";

import { ServerActionReturn } from "../model/serverAction.types";

type ServerActionReturnWithoutType<DataType> = Omit<ServerActionReturn<DataType>, "type">;

async function logServerActionResult(type: NotificationType, message: string) {
  const session = await getServerSession(authOptions);

  const time = new Date().toLocaleString();

  const user = session?.user;

  console.log(`${type}: ${time} ${message} user id=${user?.id} lastname=${user?.lastName}`);
}

export async function returnSuccess<DataType = undefined>({
  data,
  message,
  code,
}: ServerActionReturnWithoutType<DataType>): Promise<ServerActionReturn<DataType>> {
  await logServerActionResult("success", message);

  return {
    data,
    message,
    code: code || 200,
    type: "success",
  };
}

export async function returnError<DataType = undefined>({
  data,
  message,
  code,
}: ServerActionReturnWithoutType<DataType>): Promise<ServerActionReturn<DataType>> {
  await logServerActionResult("error", message);

  return {
    data,
    message,
    code: code || 500,
    type: "error",
  };
}
