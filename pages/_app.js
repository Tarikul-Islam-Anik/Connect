import Head from "next/head";
import { ToastContainer } from "react-toastify";
import { ChatContextProvider } from "../context/ChatContext";
import { AuthContextProvider } from "./../context/AuthContext";
import { ChatSelectedContextProvider } from "../context/ChatSelected";
import "../styles/globals.css";

export default function Connect({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <title>Connect | Messaging App</title>
        <meta
          name="description"
          content="Connect is a simple chat app that allows you to chat with your friends and family."
        />
        <link rel="icon" type="image/svg" href="public/favicon.svg" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta property="og:url" content="www.connect-me.vercel.app" />
        <meta property="og:type" content="article" />
        <meta property="og:title" content="Connect - a simple chat app" />
        <meta
          property="og:description"
          content="Connect is a simple chat app that allows you to chat with your friends and family."
        />
        <meta property="og:image" content="public/og-image.png" />
      </Head>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <AuthContextProvider>
        <ChatContextProvider>
          <ChatSelectedContextProvider>
            <Component {...pageProps} />
          </ChatSelectedContextProvider>
        </ChatContextProvider>
      </AuthContextProvider>
    </>
  );
}
