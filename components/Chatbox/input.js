import { useContext, useState } from "react";
import {
  doc,
  updateDoc,
  arrayUnion,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { v4 as uuid } from "uuid";
import { storage, db } from "../../firebase/firebase";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "./../../context/ChatContext";

export const Input = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const handleSend = async () => {
    if (text.trim() === "") return;
    if (img) {
      const storageRef = ref(storage, uuid());
      const uploadTask = uploadBytesResumable(storageRef, img);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // TODO: Add features using snapshot
        },

        (error) => {
          console.log(error);
        },

        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateDoc(doc(db, "chats", data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text,
                senderId: currentUser.uid,
                date: Timestamp.now(),
                img: downloadURL,
              }),
            });
          });
        }
      );
    } else {
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        }),
      });
    }

    // Updates last message data for current user
    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [data.chatId + ".lastMessage"]: { text },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    // Updates last message data for other user
    await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.chatId + ".lastMessage"]: { text },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    setText("");
    setImg(null);
  };

  return (
    <div className="absolute bottom-4 w-full">
      <div className="mx-4 flex h-12 flex-row items-center rounded-lg bg-neutral-200/75 px-2">
        <input
          type="text"
          className="flex h-10 w-full items-center rounded-lg bg-transparent pl-2 text-sm focus:outline-none"
          placeholder="Type your message...."
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" ? handleSend() && setText("") : null
          }
          value={text}
        />
        <div className="flex flex-row">
          <label
            htmlFor="img-share"
            className="pop_animation relative ml-1 mr-2 flex cursor-pointer items-center justify-center"
          >
            {img && (
              <button onClick={() => setImg(null)}>
                <span class="absolute top-1 -right-[.115rem] inline-flex h-3 w-3 animate-ping rounded-full bg-neutral-500 text-xs text-white" />
                <span class="absolute top-1 -right-[.115rem] inline-flex h-3 w-3 rounded-full bg-neutral-500 text-xs text-white" />
              </button>
            )}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-6 w-6 stroke-neutral-500"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 10C10.1046 10 11 9.10457 11 8C11 6.89543 10.1046 6 9 6C7.89543 6 7 6.89543 7 8C7 9.10457 7.89543 10 9 10Z"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M13 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22H15C20 22 22 20 22 15V10"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M15.75 5H21.25"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M18.5 7.75V2.25"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M2.67004 18.9501L7.60004 15.6401C8.39004 15.1101 9.53004 15.1701 10.24 15.7801L10.57 16.0701C11.35 16.7401 12.61 16.7401 13.39 16.0701L17.55 12.5001C18.33 11.8301 19.59 11.8301 20.37 12.5001L22 13.9001"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <input
              type="file"
              id="img-share"
              className="hidden"
              onChange={(e) => setImg(e.target.files[0])}
            />
          </label>
          <button
            onClick={() => {
              handleSend() && setText("");
            }}
            className="pop_animation flex items-center justify-center rounded-lg p-1.5 transition hover:bg-black/5"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-6 w-6 stroke-neutral-500"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.39999 6.32003L15.89 3.49003C19.7 2.22003 21.77 4.30003 20.51 8.11003L17.68 16.6C15.78 22.31 12.66 22.31 10.76 16.6L9.91999 14.08L7.39999 13.24C1.68999 11.34 1.68999 8.23003 7.39999 6.32003Z"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10.11 13.6501L13.69 10.0601"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
