"use server";

import { ragChat } from "@/lib/rag-chat";

export const addFileInRagChat = async (file: any) => {
  await ragChat.context.add({
    type: "pdf",
    fileSource: file, // Placeholder for base URL content
  });
};
