/**
 * WhatsApp Message Obfuscator
 * Popup script to handle UI interactions and display status
 */

document.addEventListener("DOMContentLoaded", () => {
  const alertContainer = document.getElementById("alert-container");

  // Listen for messages from content script
  chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "structureChanged") {
      alertContainer.style.display = "block";
      alertContainer.innerHTML = `
        <div class="alert">
          <strong>Warning:</strong> WhatsApp may have changed its structure.
          <ul>
            ${message.issues.map((issue) => `<li>${issue}</li>`).join("")}
          </ul>
          <button id="dismiss-alert">Dismiss</button>
        </div>
      `;

      document
        .getElementById("dismiss-alert")
        ?.addEventListener("click", () => {
          alertContainer.style.display = "none";
        });
    }
  });
});
