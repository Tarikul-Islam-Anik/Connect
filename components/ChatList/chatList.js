import { useEffect, useState, useContext } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { AuthContext } from "./../../context/AuthContext";
import { ChatContext } from "./../../context/ChatContext";
import { ChatSelectedContext } from "./../../context/ChatSelected";
import { Card } from "./Card/card";

export default function ChatList() {
  const [chats, setChats] = useState([]);

  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);
  const { chatSelectedDispatch } = useContext(ChatSelectedContext);

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        setChats(doc.data());
      });

      return () => {
        unsub();
      };
    };

    currentUser.uid && getChats();
  }, [currentUser.uid]);

  const handleSelect = (user) => {
    dispatch({
      type: "CHANGE_USER",
      payload: user,
    });

    chatSelectedDispatch({
      type: "SELECTED",
      payload: true,
    });
  };
  return (
    <div className="mt-4 mr-2 max-h-[80vh] space-y-4 overflow-y-auto overflow-x-hidden scroll-smooth pr-2">
      {chats ? (
        Object.entries(chats)
          ?.sort(
            (currentUser, otherUser) => otherUser[1].date - currentUser[1].date
          )
          .map((chat) => (
            <button
              key={chat[0]}
              onClick={() => handleSelect(chat[1].userInfo)}
              className="relative w-full rounded-lg p-4 transition duration-300 hover:bg-black/10"
            >
              <Card
                name={chat[1].userInfo.displayName}
                img={chat[1].userInfo.photoURL}
                msg={chat[1].lastMessage?.text}
                time={chat[1].date}
              />
            </button>
          ))
      ) : (
        <p className="text-center text-sm italic text-gray-400">
          No message available. Start a new conversation.
        </p>
      )}
    </div>
  );
}
