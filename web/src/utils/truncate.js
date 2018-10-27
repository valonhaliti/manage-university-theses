export const truncateWithEllipses = (text="", max=300) => {
  if (!text) return '';  
  const delimiter = '...';
  return text.length > max ? text.substr(0, max) + delimiter : text;
}
