import { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import { MessageTime } from "../Utilities/messageTime";

export const MessagePlaceholder = ({ msg }) => {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const msgRef = useRef();

  useEffect(() => {
    msgRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msg]);

  const isChatOwner = currentUser.uid === msg.senderId;
  const photo = isChatOwner ? currentUser?.photoURL : data.user?.photoURL;
  const displayName = isChatOwner ? "You" : data.user?.displayName;

  return (
    <div
      className={`${isChatOwner && "flex flex-col items-end"} mt-4 pr-2 space-y-2`}
      ref={msgRef}
    >
      <div className={`${isChatOwner && "flex-row-reverse"} flex items-center`}>
        <img className="h-12 w-12 rounded-lg" src={photo} alt="" />
        <div className="mx-2">
          <p className={`${isChatOwner && "text-right"} font-semibold`}>
            {displayName}
          </p>
          <time className="text-xs text-neutral-600">
            {MessageTime(msg.date)}
          </time>
        </div>
      </div>
      <div className="mb-12 max-w-2xl">
        <p
          className={`
          ${
            isChatOwner
              ? "rounded-tl-lg bg-black text-white"
              : "rounded-tr-lg bg-neutral-200/75 text-neutral-800"
          }
          inline-block rounded-br-lg rounded-bl-lg py-2 px-4`}
        >
          {msg.text}
        </p>
      </div>
      {msg.img && (
        <img
          className="mt-4 w-60 rounded-lg"
          src={msg.img}
          alt=""
        />
      )}
    </div>
  );
};
