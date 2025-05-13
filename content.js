/**
 * WhatsApp Privacy Shield
 * This script obfuscates the last message of each chat and reveals it on hover.
 */

/**
 * Shuffles the text while preserving emojis and special characters
 * @param {string} text - The text to shuffle
 * @return {string} The shuffled text
 */
function shuffleText(text) {
  const regex =
    /(\p{Extended_Pictographic}|\p{Emoji_Presentation}|[\u{1F300}-\u{1F6FF}]|[\u{2600}-\u{26FF}])/gu;
  const parts = text.split(regex);
  const emojis = text.match(regex) || [];
  let emojiIndex = 0;

  const result = parts.map((part) => {
    if (!part.trim()) return part;

    if (regex.test(part)) return part;

    const characters = part.split("");

    if (characters.length > 3) {
      const first = characters[0];
      const last = characters[characters.length - 1];
      const middle = characters.slice(1, characters.length - 1);

      for (let i = middle.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [middle[i], middle[j]] = [middle[j], middle[i]];
      }

      return first + middle.join("") + last;
    }
    return part;
  });

  for (let i = 0; i < result.length; i++) {
    if (!result[i] && emojis[emojiIndex]) {
      result[i] = emojis[emojiIndex++];
    }
  }

  return result.join("");
}

/**
 * Processes and obfuscates messages in the chat list
 */
function processMessages() {
  const possibleSelectors = [
    '[role="listitem"]',
    '[data-testid="cell-frame-container"]',
    ".chat-item",
    "div[data-id]",
  ];

  let messages = [];

  for (const selector of possibleSelectors) {
    messages = document.querySelectorAll(selector);
    if (messages.length > 0) {
      break;
    }
  }

  if (messages.length === 0) {
    setTimeout(processMessages, 2000);
    return;
  }

  messages.forEach((item) => {
    let messageElement = null;

    const candidates = [
      ...Array.from(item.querySelectorAll('span[dir="ltr"]')).filter(
        (el) => el.childElementCount === 0 && el.textContent.trim().length > 0
      ),
      ...Array.from(
        item.querySelectorAll(
          'div[data-testid="cell-frame-primary-detail"] span'
        )
      ).filter((el) => el.textContent.trim().length > 0),
    ];

    messageElement = candidates[0];

    if (!messageElement) return;

    if (messageElement.dataset.originalText) return;

    const originalText = messageElement.textContent;
    messageElement.dataset.originalText = originalText;

    const shuffledText = shuffleText(originalText);
    messageElement.textContent = shuffledText;

    messageElement.classList.add("obfuscated-message");

    item.addEventListener("mouseenter", () => {
      messageElement.textContent = originalText;
    });

    item.addEventListener("mouseleave", () => {
      messageElement.textContent = shuffledText;
    });
  });
}

/**
 * Initializes mutation observer to detect when new chats are loaded
 */
function initObserver() {
  const chatContainerSelector = '[aria-label="Lista de conversas"]';

  const checkContainer = setInterval(() => {
    const chatContainer = document.querySelector(chatContainerSelector);

    if (chatContainer) {
      clearInterval(checkContainer);
      processMessages();

      const observer = new MutationObserver((mutations) => {
        processMessages();
      });

      observer.observe(chatContainer, {
        childList: true,
        subtree: true,
      });
    }
  }, 1000);
}

/**
 * Checks for changes in WhatsApp Web structure
 */
function checkWhatsAppStructure() {
  const selectors = {
    messageList: '[role="listitem"]',
    chatContainer: '[aria-label="Lista de conversas"]',
  };

  let issues = [];

  if (document.querySelectorAll(selectors.messageList).length === 0) {
    issues.push(`Selector ${selectors.messageList} didn't find any elements.`);
  }

  if (!document.querySelector(selectors.chatContainer)) {
    issues.push(
      `Selector ${selectors.chatContainer} didn't find any elements.`
    );
  }

  if (issues.length > 0) {
    chrome.runtime
      .sendMessage({
        action: "structureChanged",
        issues: issues,
      })
      .catch((e) => {
        // Ignores connection errors with popup (might not be open)
      });
  }

  setTimeout(checkWhatsAppStructure, 15 * 60 * 1000);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    initObserver();
    checkWhatsAppStructure();
  });
} else {
  initObserver();
  checkWhatsAppStructure();
}
