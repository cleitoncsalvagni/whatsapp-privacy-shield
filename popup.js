/**
 * WhatsApp Privacy Shield
 * Popup script to handle UI interactions and display status
 */

document.addEventListener("DOMContentLoaded", () => {
  const alertContainer = document.getElementById("alert-container");
  const githubLink = document.getElementById("github-link");
  const changelogLink = document.getElementById("changelog-link");
  const version = document.querySelector(".version");

  // Set the repository URL - you'll need to update this with your actual GitHub repository URL
  const GITHUB_REPO_URL =
    "https://github.com/cleitoncsalvagni/whatsapp-privacy-shield";

  // Get extension version from manifest
  if (chrome.runtime.getManifest && version) {
    version.textContent = "v" + chrome.runtime.getManifest().version;
  }

  // Set up GitHub link
  if (githubLink) {
    githubLink.addEventListener("click", (e) => {
      e.preventDefault();
      chrome.tabs.create({ url: GITHUB_REPO_URL });
    });
  }

  // Set up Changelog link
  if (changelogLink) {
    changelogLink.addEventListener("click", (e) => {
      e.preventDefault();
      chrome.tabs.create({ url: `${GITHUB_REPO_URL}/blob/main/CHANGELOG.md` });
    });
  }

  // Listen for messages from content script
  chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "structureChanged") {
      alertContainer.style.display = "block";
      const issuesHtml = message.issues
        .map((issue) => `<li>${issue}</li>`)
        .join("");

      alertContainer.innerHTML = `
        <div class="alert">
          <strong>Warning:</strong> WhatsApp may have changed its structure.
          <ul>${issuesHtml}</ul>
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
