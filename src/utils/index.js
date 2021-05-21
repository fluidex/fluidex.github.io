export const formatDate = (date, langKey) => {
  const dateObj = date instanceof Date ? date : new Date(date);

  switch (langKey) {
    case "en":
      return dateObj.toLocaleDateString("en", {
        month: "long",
        year: "numeric",
        day: "numeric",
      });
    case "zh":
      return dateObj.toLocaleDateString("zh", {
        month: "numeric",
        year: "numeric",
        day: "numeric",
      });
    default:
      return dateObj.toLocaleDateString();
  }
};
