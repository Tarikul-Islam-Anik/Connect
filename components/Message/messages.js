import { useContext, useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { ChatContext } from "./../../context/ChatContext";
import { MessagePlaceholder } from "./messagePlaceholder";

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const { data } = useContext(ChatContext);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
      doc.exists() && setMessages(doc.data().messages);
    });
    return () => {
      unsub();
    };
  }, [data.chatId]);

  return (
    <div
      style={{ height: "calc(100vh - 160px)" }}
      className="flex ml-4 mr-2 flex-col gap-8 overflow-y-auto overflow-x-hidden"
    >
      {messages.map((msg) => (
        <MessagePlaceholder key={msg.id} msg={msg} />
      ))}
    </div>
  );
}
