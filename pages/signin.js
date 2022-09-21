import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { toast } from "react-toastify";

export default function Signin() {
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/");
    } catch (err) {
      const errorCode = err.code;
      switch (errorCode) {
        case "auth/wrong-password":
          toast.error("Wrong password.");
          break;
        case "auth/user-not-found":
          toast.error("User not found. Please sign up.");
          break;
        case "auth/too-many-requests":
          toast.error("Too many requests. Please try again later.");
          break;
        default:
          toast.error("Something went wrong. Please try again later.");
      }
    }
  };
  return (
    <>
      <Head>
        <title>Sign in | Connect</title>
      </Head>
      <form
        onSubmit={handleSubmit}
        className="flex min-h-screen items-center justify-center bg-black/5"
      >
        <div className="z-20 rounded-2xl bg-white p-8 shadow-xl">
          <div className="mb-6 space-y-4">
            <h1 className="cursor-pointer text-center text-3xl font-bold">
              Sign in
            </h1>
            <p className="w-80 cursor-pointer text-center text-sm font-semibold tracking-wide">
              Hello! Enter your details to get signed in to your account.
            </p>
          </div>
          <div className="space-y-4">
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
          </div>
          <div className="mt-6 text-center">
            <button className="btn pop_animation bg-black">
              Let&apos;s Go!
            </button>
            <p className="mt-4 text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/signup">
                <a className="underline">Sign up</a>
              </Link>
            </p>
          </div>
        </div>
      </form>
    </>
  );
}
