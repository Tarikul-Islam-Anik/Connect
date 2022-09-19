import { MessageTime } from "./../../Utilities/messageTime";

export const Card = ({ name, img, msg, time }) => {
  return (
    <>
      <div className="flex items-center space-x-4">
        <img
          src={img}
          alt={`${name}'s photo`}
          className="inline-block h-16 w-16 rounded-lg"
        />
        <div>
          <span className="absolute inset-y-7 right-5 text-xs text-gray-400">
            {MessageTime(time)}
          </span>
          <div className="flex max-w-sm flex-col items-start">
            <h3 className="font-bold text-gray-900">{name}</h3>
            <p
              className={`${
                !msg ? "italic" : ""
              } text-left text-gray-400 line-clamp-1`}
            >
              {!msg ? "Say hi to your new friend!" : msg}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
