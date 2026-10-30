DriveHub GH AI Partner — Chat Persistence Update

Purpose
- Keep the visitor's AI Partner conversation visible after refreshing or reopening the page in the same browser.
- Restore recent conversation messages and the context sent to the AI when the page reloads.
- Keep future responses connected to the currently deployed server-side AI knowledge. Updates to functions/api/chat.js and functions/api/faq-knowledge.js take effect for new messages after those files are deployed; the browser does not need to cache the knowledge base.

File to upload
- Replace the root-level script.js with this updated script.js.

Behaviour
- Conversation transcript is saved in the visitor's browser localStorage, limited to the latest 100 displayed user/assistant messages.
- The latest 12 messages are restored as context for the next AI request.
- The existing Reset/Clear conversation control intentionally clears the saved transcript.
- No account, cross-device sync, or server-side storage is added. Clearing browser site data or using a different browser/device will not preserve the conversation.

Deployment
1. Replace script.js in the repository root.
2. Commit and let Cloudflare Pages deploy.
3. Open the AI Partner page, exchange a few messages, refresh, and confirm the messages remain.
4. Send a new question after refresh and verify the AI responds using the latest deployed knowledge.

This package contains only the updated front-end file plus this README. It has not been deployed to the live site.
