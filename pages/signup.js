import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, storage, db } from "../firebase/firebase";
import { doc, setDoc } from "firebase/firestore";

export default function Signup() {
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3].files[0];
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const storageRef = ref(storage, email);
      const uploadTask = uploadBytesResumable(storageRef, file);
      toast.promise(uploadTask, {
        pending: "Creating an account. Please wait...",
        success: "Account created successfully.",
        error: "Something went wrong. Please try again later.",
      });
      uploadTask.on(
        "state_changed",
        (snapshot) => {},
        (error) => {
          toast.error(error.message.slice(10, 50));
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateProfile(res.user, {
              displayName,
              photoURL: downloadURL,
            });
            await setDoc(doc(db, "users", res.user.uid), {
              uid: res.user.uid,
              displayName,
              email,
              photoURL: downloadURL,
            });
            await setDoc(doc(db, "userChats", res.user.uid), {});
            router.push("/");
          });
        }
      );
    } catch (error) {
      switch (error.code) {
        case "auth/email-already-in-use":
          toast.error("Email already in use.");
          break;
        case "auth/invalid-email":
          toast.error("Invalid email.");
          break;
        case "auth/weak-password":
          toast.error("Weak password. Password must be at least 6 characters.");
          break;
        default:
          toast.error("Something went wrong. Please try again later.");
      }
    }
  };
  return (
    <>
      <Head>
        <title>Sign up | Connect</title>
      </Head>
      <div className="font-inter grid h-screen place-items-center bg-black/5">
        <div className="form-card sm:h[80vh] h-[85vh] w-[50vh]">
          <div className="w-[90%]">
            <div className="mb-4 flex flex-col items-center justify-center">
              <h1 className="mb-2 text-2xl font-bold">Sign up</h1>
              <p className="w-[90%] text-center">
                Welcome to Connect chat app. Please create a new account to
                continue.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-2">
                <label htmlFor="name" className="label">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="name"
                  autoComplete="off"
                  required
                  placeholder="Your Email"
                  className="input focus"
                />
                <label htmlFor="email" className="label">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="off"
                  required
                  placeholder="Your Email"
                  className="input focus"
                />
                <label htmlFor="password" className="label">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="off"
                  required
                  placeholder="Your Password"
                  className="input focus"
                />
                <label
                  htmlFor="file"
                  className="my-4 block text-sm font-medium text-gray-600"
                >
                  Profile Picture
                </label>
                <input
                  type="file"
                  id="file"
                  required
                  className="file-input focus:outline-none"
                />
              </div>
              <div>
                <button className="btn focus bg-black hover:opacity-75 focus:ring-black focus:ring-offset-white">
                  Sign up
                </button>
              </div>
            </form>
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-neutral-600">
                  {" "}
                  Already have an account?{" "}
                </span>
              </div>
            </div>
            <div>
              <Link href="/signin">
                <a
                  className="btn focus bg-black/10 text-black hover:opacity-75
                 focus:ring-black/10 focus:ring-offset-white"
                >
                  Sign in here
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
