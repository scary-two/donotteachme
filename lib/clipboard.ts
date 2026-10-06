/** Copy on HTTPS/localhost, with a fallback for local-network HTTP previews. */
export async function copyText(text: string): Promise<void> {
  if (window.isSecureContext && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch {
      // Some browsers deny the Clipboard API but still allow a user-initiated copy.
    }
  }

  const activeElement = document.activeElement;
  const selection = window.getSelection();
  const ranges = selection
    ? Array.from({length: selection.rangeCount}, (_, index) =>
        selection.getRangeAt(index).cloneRange(),
      )
    : [];
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.readOnly = true;
  textarea.tabIndex = -1;
  Object.assign(textarea.style, {
    position: "fixed",
    top: "0",
    left: "0",
    width: "1px",
    height: "1px",
    opacity: "0",
    fontSize: "16px",
    pointerEvents: "none",
  });
  document.body.appendChild(textarea);

  try {
    textarea.focus({preventScroll: true});
    textarea.select();
    textarea.setSelectionRange(0, text.length);
    // Compatibility fallback only; the modern Clipboard API is preferred above.
    if (!document.execCommand("copy")) {
      throw new Error("The browser did not allow copying.");
    }
  } finally {
    textarea.remove();
    if (activeElement instanceof HTMLElement) {
      activeElement.focus({preventScroll: true});
    }
    if (selection) {
      selection.removeAllRanges();
      ranges.forEach((range) => selection.addRange(range));
    }
  }
}
