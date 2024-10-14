// src/app/api/upload/route.ts

import { addFileInRagChat } from "@/services/ragchat";
import { addinRedis, checkIfExistsinRedis } from "@/services/redis";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const isAlreadyExisted = await checkIfExistsinRedis(file.name);
  if (!isAlreadyExisted) {
    await addinRedis(file.name);
    await addFileInRagChat(file);
  }

  return NextResponse.json({ message: "File uploaded successfully" });
}
