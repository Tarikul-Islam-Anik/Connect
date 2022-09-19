import { useContext, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  doc,
} from "firebase/firestore";
import { toast } from "react-toastify";
import { db } from "../../firebase/firebase";
import { AuthContext } from "../../context/AuthContext";

export default function Search() {
  const [email, setEmail] = useState("");
  const [user, setUser] = useState(null);

  const { currentUser } = useContext(AuthContext);

  const searchUser = async () => {
    // perform a query on severside
    const q = query(collection(db, "users"), where("email", "==", email));

    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUser(doc.data());
      });
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleKeyDown = (e) => {
    e.key === "Enter" && searchUser();
  };

  const handleSelect = async () => {
    const combinedID =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;
    try {
      const res = await getDoc(doc(db, "chats", combinedID));

      // creates an empty chat
      if (!res.exists()) {
        await setDoc(doc(db, "chats", combinedID), {
          messages: [],
        });

        // create a chat for current user
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedID + ".userInfo"]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [combinedID + ".date"]: serverTimestamp(),
        });

        // create a chat for other user
        await updateDoc(doc(db, "userChats", user.uid), {
          [combinedID + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedID + ".date"]: serverTimestamp(),
        });
      }
      setUser(null);
      setEmail("");
    } catch (error) {
      toast.error(error.message);
    }
  };
  return (
    <>
      <div
        className="relative pr-4"
      >
        <input
          type="text"
          placeholder="Find users with email"
          onKeyDown={handleKeyDown}
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          className="input focus pl-10 placeholder:text-gray-400"
        />
        <svg
          width="24"
          height="24"
          fill="none"
          aria-hidden="true"
          className="absolute top-3 left-3 text-gray-400"
        >
          <path
            d="m19 19-3.5-3.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
          <circle
            cx="11"
            cy="11"
            r="6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></circle>
        </svg>
      </div>
      {user && email && (
        <div className="mt-3 mr-4 cursor-pointer space-y-4 rounded-lg border p-2 text-center transition duration-700">
          <div
            onClick={handleSelect}
            className="flex items-center space-x-3 rounded-lg p-2 transition hover:bg-black/10"
          >
            <img
              className="h-16 w-16 rounded-lg object-cover"
              src={user?.photoURL}
              alt={user?.displayName}
            />
            <p className="font-bold">{user?.displayName}</p>
          </div>
        </div>
      )}
    </>
  );
}
