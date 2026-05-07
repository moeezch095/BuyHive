export const toSlug = (name) => {
  return name.toLowerCase().replace(/\s+/g, "_");
};