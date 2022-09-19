export const MessageTime = (time, long = false) => {
  if (long) {
    return new Date(time?.toDate()).toLocaleString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
  } else {
    if (new Date(time?.toDate()).toDateString() === new Date().toDateString()) {
      return new Date(time?.toDate()).toLocaleString("en-US", {
        hour: "numeric",
        minute: "numeric",
      });
    } else if (
      new Date(time?.toDate()).toDateString() ===
      new Date(new Date().setDate(new Date().getDate() - 1)).toDateString()
    ) {
      return "Yesterday";
    } else if (
      new Date(time?.toDate()).toDateString() >
        new Date(new Date().setDate(new Date().getDate() - 7)).toDateString() &&
      new Date(time?.toDate()).toDateString() <
        new Date(new Date().setDate(new Date().getDate() - 1)).toDateString()
    ) {
      return new Date(time?.toDate()).toLocaleString("en-US", {
        weekday: "long",
      });
    } else {
      return new Date(time?.toDate()).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  }
};
