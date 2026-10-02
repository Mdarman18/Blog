export function optimizeImage(url, width = 800) {
  if (typeof url !== "string" || !url.includes("/upload/")) {
    return url;
  }

  return url.replace("/upload/", `/upload/f_auto,q_auto,w_${width}/`);
}
