// Time formatting utilities

/**
 * Format time for header display
 */
export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString("en-US", {
    hour12: false,
    timeZone: "Europe/Paris",
  });
};

/**
 * Format date for display
 */
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString("en-GB", {
    timeZone: "Europe/Paris",
  });
};

/**
 * Get current Paris time
 */
export const getParisTime = (): Date => {
  return new Date();
};
