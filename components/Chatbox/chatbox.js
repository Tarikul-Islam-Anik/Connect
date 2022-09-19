import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import { ChatSelectedContext } from "../../context/ChatSelected";
import Messages from "./../Message/messages";
import { Input } from "./input";

export default function ChatBox() {
  const { data } = useContext(ChatContext);
  const { selected } = useContext(ChatSelectedContext);

  return (
    <div className="relative h-screen w-full bg-gray-50">
      {selected ? (
        <>
          <div className="items-center border-b bg-white py-4 text-sm">
            <div className="flex items-center space-x-2">
              <img
                className="mx-4 h-12 w-12 rounded-lg"
                src={data.user?.photoURL}
              />
              <p className="font-semibold">{data.user?.displayName}</p>
            </div>
          </div>
          <Messages />
          <Input />
        </>
      ) : (
        <div className="grid h-full place-items-center">
          <h3 className="text-2xl font-semibold text-gray-400">
            Select a chat or start a new conversation
          </h3>
        </div>
      )}
    </div>
  );
}
