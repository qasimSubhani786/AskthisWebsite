import React from "react";
import { ragChat } from "../lib/rag-chat";
import { redis } from "../lib/redis";
import { ChatWrapper } from "@/components/chat-wrapper";
import { cookies } from "next/headers";

export type ChatType = "URL" | "PDF";

export default async function Page() {
  const sessionCookie = cookies().get("sessionId")?.value || "";
  const sessionId = (sessionCookie + "--base").replace(/\//g, ""); // Handling base URL session

  const initialMessages = await ragChat.history.getMessages({
    sessionId,
    amount: 10,
  });

  return (
    <ChatWrapper
      chatType="PDF"
      sessionId={sessionId}
      initialMessages={initialMessages}
    />
  );
}
