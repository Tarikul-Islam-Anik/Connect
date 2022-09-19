import { useRouter } from "next/router";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export const ProtectedRoute = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  const router = useRouter();
  if (currentUser) {
    return children;
  } else {
    router.push("/signin");
  }
};
