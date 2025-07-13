#!/bin/bash

# MacX Installer Script
# This script downloads and installs MacX on macOS

set -e

# ASCII Art
echo ""
echo "███╗   ███╗ █████╗  ██████╗██╗  ██╗"
echo "████╗ ████║██╔══██╗██╔════╝╚██╗██╔╝"
echo "██╔████╔██║███████║██║      ╚███╔╝ "
echo "██║╚██╔╝██║██╔══██║██║      ██╔██╗ "
echo "██║ ╚═╝ ██║██║  ██║╚██████╗██╔╝ ██╗"
echo "╚═╝     ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝"
echo "                                    "
echo "Modern Code Editor for macOS"
echo ""

# Check if running on macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    echo "Error: This installer is only for macOS"
    exit 1
fi

# Check if curl is available
if ! command -v curl &> /dev/null; then
    echo "Error: curl is required but not installed"
    exit 1
fi

# Request administrator privileges
echo "Administrator access is required for installation. Please enter your password."
sudo -v

# Keep sudo alive
while true; do sudo -n true; sleep 60; kill -0 "$$" || exit; done 2>/dev/null &

# Variables
REPO="Yerexx/MacX-Releases"
DMG_NAME="MacX_Installer.dmg"
APP_NAME="MacX.app"
MOUNT_POINT="/Volumes/MacX"
TEMP_DIR=$(mktemp -d)
TEMP_DMG="$TEMP_DIR/$DMG_NAME"

echo "Checking for latest version..."

# Try to get latest version from GitHub API
LATEST_VERSION=$(curl -s "https://api.github.com/repos/$REPO/releases/latest" | grep '"tag_name":' | sed -E 's/.*"([^"]+)".*/\1/' 2>/dev/null || echo "")

if [ -z "$LATEST_VERSION" ]; then
    echo "Error: Could not fetch latest version info"
    echo "Falling back to direct download..."
    LATEST_VERSION="v1.0.1"
fi

echo "Latest version: $LATEST_VERSION"

# Check if MacX is already installed and get current version
if [ -d "/Applications/$APP_NAME" ]; then
    CURRENT_VERSION=$(defaults read "/Applications/$APP_NAME/Contents/Info.plist" CFBundleShortVersionString 2>/dev/null || echo "unknown")
    echo "Current installed version: $CURRENT_VERSION"
    
    # Compare versions (remove 'v' prefix for comparison)
    LATEST_NUM=$(echo "$LATEST_VERSION" | sed 's/^v//')
    CURRENT_NUM=$(echo "$CURRENT_VERSION" | sed 's/^v//')
    
    if [ "$CURRENT_NUM" = "$LATEST_NUM" ]; then
        echo "✅ MacX is already up to date (version $CURRENT_VERSION)!"
        echo "No update needed."
        exit 0
    elif [ "$CURRENT_NUM" != "unknown" ]; then
        echo "📦 Update available: $CURRENT_VERSION → $LATEST_VERSION"
        echo "Proceeding with update..."
    fi
else
    echo "MacX not found. Proceeding with fresh installation..."
fi

# Download URL
DOWNLOAD_URL="https://raw.githubusercontent.com/$REPO/main/$DMG_NAME"

echo "Downloading MacX $LATEST_VERSION..."
if ! curl -L "$DOWNLOAD_URL" -o "$TEMP_DMG" --progress-bar; then
    echo "Error: Failed to download MacX"
    exit 1
fi

echo "Installing MacX $LATEST_VERSION..."
# Mount the DMG
MOUNT_OUTPUT=$(hdiutil attach -nobrowse -noautoopen "$TEMP_DMG" 2>/dev/null)
if [ $? -ne 0 ]; then
    echo "Error: Failed to mount disk image"
    exit 1
fi

# Find the actual mount point
ACTUAL_MOUNT_POINT=$(echo "$MOUNT_OUTPUT" | grep "/Volumes/" | awk '{print $NF}')
if [ -z "$ACTUAL_MOUNT_POINT" ]; then
    echo "Error: Could not determine mount point"
    exit 1
fi

# Copy the app to Applications
if [ -d "$ACTUAL_MOUNT_POINT/$APP_NAME" ]; then
    echo "Copying MacX to Applications folder..."
    sudo ditto "$ACTUAL_MOUNT_POINT/$APP_NAME" "/Applications/$APP_NAME"
    
    # Set proper permissions
    sudo chown -R root:wheel "/Applications/$APP_NAME"
    sudo chmod -R 755 "/Applications/$APP_NAME"
else
    echo "Error: MacX.app not found in disk image"
    hdiutil detach "$ACTUAL_MOUNT_POINT" > /dev/null 2>&1
    exit 1
fi

# Unmount the DMG
hdiutil detach "$ACTUAL_MOUNT_POINT" > /dev/null

# Clean up
rm -rf "$TEMP_DIR"

echo "✅ MacX has been successfully installed!"
echo "You can find it in your Applications folder."
echo ""
echo "To launch MacX, you can:"
echo "1. Open it from your Applications folder"
echo "2. Use Spotlight search (Cmd+Space) and type 'MacX'"
echo "3. Run 'open -a MacX' from Terminal"
echo ""
echo "Thank you for installing MacX! 🚀"