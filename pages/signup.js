import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { toast } from "react-toastify";
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
      <form
        onSubmit={handleSubmit}
        className="flex min-h-screen items-center justify-center bg-black/5"
      >
        <div className="z-20 rounded-2xl bg-white p-8 shadow-xl">
          <div className="mb-6 space-y-4">
            <h1 className="cursor-pointer text-center text-3xl font-bold">
              Sign up
            </h1>
            <p className="w-80 cursor-pointer text-center text-sm font-semibold tracking-wide">
              Welcome to Connect chat app. Please create a new account to
              continue.
            </p>
          </div>
          <div className="space-y-4">
            <label htmlFor="name" className="label">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="name"
              autoComplete="off"
              required
              placeholder="Name"
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
              placeholder="Email address"
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
              placeholder="Password"
              className="input focus"
            />
            <label htmlFor="file" className="label">
              Profile Picture
            </label>
            <input
              type="file"
              id="file"
              required
              className="file-input focus:outline-none"
            />
          </div>
          <div className="mt-6 text-center">
            <button className="btn pop_animation bg-black">
              Create account
            </button>
            <p className="mt-4 text-sm">
              Already have an account?{" "}
              <Link href="/signin">
                <a className="underline">Sign in</a>
              </Link>
            </p>
          </div>
        </div>
      </form>
    </>
  );
}
