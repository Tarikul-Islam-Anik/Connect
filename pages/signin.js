import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
      <div className="font-inter grid h-screen place-items-center bg-black/5">
        <div className="form-card h-[65vh] w-[50vh]">
          <div className="flex flex-col items-center justify-center">
            <h1 className="mb-2 text-2xl font-bold">Sign in</h1>
            <p className="w-[90%] text-center">
              Hello! Enter your details to get signed in to your account.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="w-[90%] space-y-6">
            <div className="grid grid-cols-1 gap-2">
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
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  placeholder="Your password"
                  className="h-3.5 w-3.5 cursor-pointer rounded-xl accent-black focus:outline-none"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block cursor-pointer text-sm text-neutral-600"
                >
                  {" "}
                  Remember me{" "}
                </label>
              </div>
              <a
                aria-disabled="true"
                className="focus cursor-not-allowed text-sm font-medium text-black"
              >
                Forgot your password?
              </a>
            </div>
            <div>
              <button type="submit" className="btn focus bg-black">
                Sign in
              </button>
            </div>
          </form>
          <div className="relative my-4 w-[90%]">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-neutral-600">
                Don&apos;t have an account?
              </span>
            </div>
          </div>
          <Link href="/signup">
            <a className="btn focus w-[90%] bg-black/10 text-black hover:opacity-75">
              Sign up here
            </a>
          </Link>
        </div>
      </div>
    </>
  );
}
