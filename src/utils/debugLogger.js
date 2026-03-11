export const debugLogger = (...args) => {
  if (import.meta.env.MODE === "development") {
    console.log(...args);
  }
};
