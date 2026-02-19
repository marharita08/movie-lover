export const getFallback = (name?: string) => {
  if (name) {
    return name
      .split(" ")
      .map((name) => name.charAt(0).toUpperCase())
      .join("");
  } else {
    return "??";
  }
};
