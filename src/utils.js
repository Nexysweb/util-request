/**
 * copy to clipboard
 * @param  e
 * @return -
 */
export const copyToClipboard = e => {
  e.preventDefault();

  const node = e.currentTarget.nextSibling;

  var isChrome = !!window.chrome && !!window.chrome.webstore;

  // TODO: reliant algorithm that retrieves text
  const selection = window.getSelection();
  const range = document.createRange();
  if (isChrome) range.selectNode(node);
  else range.selectNodeContents(node);
  selection.removeAllRanges();
  selection.addRange(range);

  try {
    document.execCommand('copy');
  } catch(e) {
    console.log(e);
  }

  selection.removeAllRanges();
}