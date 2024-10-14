"use client";
import { useChat } from "ai/react";
import { type Message } from "ai/react";
import React, { useEffect, useState } from "react";
import Messages from "../messages";
import { ChatInput } from "../chat-input";
import { ChatType } from "@/app/page";
import { redis } from "@/lib/redis";
import { ragChat } from "@/lib/rag-chat";
import { Button } from "@nextui-org/react";
import { addinRedis, checkIfExistsinRedis } from "@/services/redis";
import { addFileInRagChat } from "@/services/ragchat";

type Props = {
  sessionId: string;
  initialMessages: Message[];
  chatType: ChatType;
};

export function ChatWrapper({ sessionId, initialMessages, chatType }: Props) {
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const checkFileExistsOrNot = async () => {
    debugger;
    const fileName = localStorage.getItem("PDF_FILENAME") || "";

    const ifExisits = await checkIfExistsinRedis(fileName);
    setIsFileUploaded(ifExisits === 1 ? true : false);
  };
  useEffect(() => {
    checkFileExistsOrNot();
  }, []);

  const { messages, input, handleInputChange, handleSubmit, setInput } =
    useChat({
      api: "/api/chat-stream",
      body: {
        sessionId,
      },
      initialMessages,
    });

  const onUploadButtonPress = async (file: File) => {
    if (chatType === "PDF") {
      console.log("File to be uploaded", file);
      try {
        // Use FormData to send the file to the server
        const formData = new FormData();
        formData.append("file", file);
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        localStorage.setItem("PDF_FILENAME", file.name);
        const result = await response.json();

        if (response.ok) {
          console.log("File uploaded successfully", result);
          setIsFileUploaded(true);
        } else {
          console.error("Error uploading file:", result.error);
        }
      } catch (error) {
        console.log("Error", error);
      }
    }
  };

  return (
    <div className="relative min-h-full bg-zinc-900 flex divide-y divide-zinc-700 flex-col justify-between gap-2">
      <div className="flex-1 text-black bg-zinc-800  justify-between flex flex-col">
        <Messages
          onUploadButtonPress={onUploadButtonPress}
          chatType={chatType}
          messages={messages}
          isFileUploaded={isFileUploaded}
        />
      </div>

      <ChatInput
        setInput={setInput}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        input={input}
      />
    </div>
  );
}
