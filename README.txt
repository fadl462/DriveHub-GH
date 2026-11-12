DriveHub GH — Signature alignment fix

Replace these files in your repository:
- command/app.js
- command/fadl-signature.png (retain this asset; included for completeness)

The Authorised By label is now followed by a dedicated signature line. The handwritten signature is positioned over that line rather than sitting separately to its right. This is applied to both invoice and receipt print layouts. No typed name is added.

Commit and push the files, wait for Cloudflare Pages deployment, then test one invoice and one receipt print preview.
