#!/bin/bash
set -e

INSTALL_DIR="$HOME/.local/share/github-desktop-electron"
BIN_DIR="$HOME/.local/bin"
DESKTOP_DIR="$HOME/.local/share/applications"

echo "📦 Instalando GitHub Desktop (Electron)..."

# Comprobar electron del sistema
if ! command -v electron &> /dev/null; then
  echo "❌ Electron no encontrado. Instálalo primero:"
  echo "   Arch/Manjaro:  sudo pacman -S electron"
  echo "   Ubuntu/Debian: sudo apt install electron"
  exit 1
fi

mkdir -p "$INSTALL_DIR"
cp main.js preload.js icon.png "$INSTALL_DIR/" 2>/dev/null || cp main.js preload.js "$INSTALL_DIR/"

mkdir -p "$BIN_DIR"
cat > "$BIN_DIR/github-app" << 'LAUNCHER'
#!/bin/bash
exec electron "$HOME/.local/share/github-desktop-electron/main.js" "$@"
LAUNCHER
chmod +x "$BIN_DIR/github-app"

mkdir -p "$DESKTOP_DIR"
cat > "$DESKTOP_DIR/github-app.desktop" << DESKTOP
[Desktop Entry]
Version=1.0
Type=Application
Name=GitHub
Comment=Cliente de Electron para GitHub
Exec=$BIN_DIR/github-app %U
Icon=$INSTALL_DIR/icon.png
Terminal=false
Categories=Network;Development;
StartupWMClass=github
DESKTOP

chmod +x "$DESKTOP_DIR/github-app.desktop"
update-desktop-database "$DESKTOP_DIR" 2>/dev/null || true

echo ""
echo "✅ Instalado. Lanza con: github-app"