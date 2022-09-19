import { createContext, useReducer } from "react";

export const ChatSelectedContext = createContext();

export const ChatSelectedContextProvider = ({ children }) => {
  const INITIAL_STATE = {
    isSelect: false,
  };

  const chatSelectedReducer = (state, action) => {
    switch (action.type) {
      case "SELECTED":
        return {
          isSelect: action.payload,
        };

      default:
        return state;
    }
  };

  const [state, chatSelectedDispatch] = useReducer(
    chatSelectedReducer,
    INITIAL_STATE
  );

  return (
    <ChatSelectedContext.Provider
      value={{ selected: state.isSelect, chatSelectedDispatch }}
    >
      {children}
    </ChatSelectedContext.Provider>
  );
};
