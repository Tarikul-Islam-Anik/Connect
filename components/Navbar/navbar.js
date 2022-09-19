import { useContext } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import { AuthContext } from "../../context/AuthContext";
import { Wishing } from "../Utilities/wishing";

export const Navbar = () => {
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="relative border-b p-4">
      <div className="flex items-center space-x-4">
        <img
          src={currentUser?.photoURL}
          alt={currentUser?.displayName}
          className="h-12 w-12 rounded-lg bg-gray-200"
        />
        <div className="flex-col items-start flex">
          <p className="text-sm text-gray-500">{Wishing()}</p>
          <h3 className="w-96 truncate text-lg font-bold text-gray-900">
            {currentUser.displayName}
          </h3>
        </div>
      </div>
      <button
        onClick={() => signOut(auth)}
        className="group absolute top-5 right-5 flex items-center rounded-lg bg-black/10 
        text-sm font-medium text-black transition hover:bg-black/20 px-5 py-2.5"
      >
        <span>Logout</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="ml-1 h-3.5 w-3.5 transition group-hover:translate-x-0.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
          <polyline points="16 17 21 12 16 7"></polyline>
          <line x1="21" y1="12" x2="9" y2="12"></line>
        </svg>
      </button>
    </div>
  );
};
