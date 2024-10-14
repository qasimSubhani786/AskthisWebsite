import React from "react";
import { ragChat } from "../../lib/rag-chat";
import { redis } from "../../lib/redis";
import { ChatWrapper } from "@/components/chat-wrapper";
import { cookies } from "next/headers";

type Props = {
  params: {
    url: string | string[] | undefined;
  };
};

const reconstructUrl = ({ url }: { url: string[] }) => {
  const decodedUrl = url.map((item) => decodeURIComponent(item));
  return decodedUrl.join("/");
};

export default async function Page({ params }: Props) {
  const sessionCookie = cookies().get("sessionId")?.value || "";

  const reconstructedUrl = reconstructUrl({ url: params.url as string[] });

  const sessionId = (sessionCookie + "--" + reconstructedUrl).replace(
    /\//g,
    ""
  );

  const initialMessages = await ragChat.history.getMessages({
    sessionId,
    amount: 10,
  });
  const isAlreadyExisted = await redis.sismember(
    "indexed-urls",
    reconstructedUrl
  );
  if (!isAlreadyExisted) {
    await ragChat.context.add({
      type: "html",
      source: reconstructedUrl,
      config: { chunkSize: 200, chunkOverlap: 50 },
    });
    await redis.sadd("indexed-urls", reconstructedUrl);
  }

  return (
    <ChatWrapper
      chatType="URL"
      sessionId={sessionId}
      initialMessages={initialMessages}
    ></ChatWrapper>
  );
}
