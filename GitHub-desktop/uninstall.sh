#!/bin/bash
echo "🗑  Desinstalando GitHub WebApp..."
rm -rf "$HOME/.local/share/github-desktop-electron"
rm -f "$HOME/.local/bin/github-app"
rm -f "$HOME/.local/share/applications/github-app.desktop"
update-desktop-database "$HOME/.local/share/applications" 2>/dev/null || true
echo "✅ Desinstalado por completo."