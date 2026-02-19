export const getFallback = (name?: string) => {
  if (name && name.trim()) {
    return name
      .split(" ")
      .map((name) => name.charAt(0).toUpperCase())
      .join("");
  } else {
    return "??";
  }
};
