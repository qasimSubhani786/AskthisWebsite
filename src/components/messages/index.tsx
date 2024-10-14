import React from "react";
import { type Message as TMessage } from "ai/react";
import { Message } from "../message";
import { MessageSquare } from "lucide-react";
import { ChatType } from "@/app/page";
import { Button } from "@nextui-org/react";

type Props = {
  messages: TMessage[];
  chatType: ChatType;
  onUploadButtonPress?: (file: File) => void;
  isFileUploaded?: boolean;
};

export default function Messages({
  messages,
  chatType,
  onUploadButtonPress,
  isFileUploaded,
}: Props) {
  const fileName = localStorage.getItem("PDF_FILENAME");
  return (
    <div className="flex  max-h-[calc(100vh-3.5rem-7rem)] flex-1 flex-col overflow-y-auto ">
      {messages && messages.length > 0 ? (
        messages.map((message, index) => (
          <Message
            content={message.content}
            isUserMessage={message.role === "user"}
            key={index}
          />
        ))
      ) : isFileUploaded ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-2">
          <div className="text-zinc-500 text-xl">
            Start Question & Ansewering to Document!
          </div>
          <div className="text-zinc-100 text-sm">{`${fileName}`}</div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center gap-2">
          <MessageSquare className="size-8 text-blue-500" />
          <h3 className="font-semibold text-xl text-white">You're all set!</h3>
          <p className="text-zinc-500 text-sm">
            Ask your first question to get started.
          </p>
          {chatType === "PDF" && (
            <div>
              <label htmlFor="file-upload" className="cursor-pointer">
                <Button as="span">Upload File</Button>
              </label>
              <input
                id="file-upload"
                type="file"
                style={{ display: "none" }} // This hides the input element
                onChange={(e) => {
                  const file = e.target.files?.[0]; // Get the selected file
                  if (file) {
                    onUploadButtonPress?.(file);
                    // Handle the file upload or processing here
                  }
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
