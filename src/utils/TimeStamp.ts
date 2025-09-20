export const formatTime = (date: Date) => {
  return date.toLocaleTimeString("en-US", {
    hour12: false,
    timeZone: "Europe/Paris",
  });
};
