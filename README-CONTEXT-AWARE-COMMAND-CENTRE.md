DriveHub GH Command Centre — Context-aware page controls

Files included:
- command/styles.css

Changes:
- Hides the global “Export overview” and “Quick action” buttons on every section except Overview.
- Hides the shared Fleet alerts panel on all pages except Fleet. Overview retains its separate operational alerts panel.
- Uses CSS :has() with the existing active view sections; current Chrome supports this selector.

This is a front-end layout change only. It does not change API/database behaviour and has not been deployed to Cloudflare Pages. Replace command/styles.css in the project and deploy to publish.
