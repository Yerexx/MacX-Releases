#!/bin/bash

RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}"
cat << "EOF"
 ███╗   ███╗ █████╗  ██████╗██╗  ██╗ 
 ████╗ ████║██╔══██╗██╔════╝╚██╗██╔╝ 
 ██╔████╔██║███████║██║      ╚███╔╝ 
 ██║╚██╔╝██║██╔══██║██║      ██╔██╗ 
 ██║ ╚═╝ ██║██║  ██║╚██████╗██╔╝ ██╗ 
 ╚═╝     ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝ 
                                     
Modern Code Editor for macOS 
EOF
echo -e "${NC}"

if [[ "$(uname)" != "Darwin" ]]; then
    echo -e "${RED}Error: This installer is only for MacOS systems${NC}"
    exit 1
fi

if ! command -v curl &> /dev/null; then
    echo -e "${RED}Error: curl is not installed${NC}"
    exit 1
fi

echo -e "${YELLOW}Administrator access is required for installation. Please enter your password.${NC}"
if ! sudo -v; then
    echo -e "${RED}Error: Failed to obtain administrator privileges${NC}"
    exit 1
fi

echo -e "${BLUE}Checking for latest version...${NC}"
TEMP_DMG=$(mktemp)

# Try to get latest version from GitHub API, fallback to direct download
LATEST_VERSION=$(curl -s https://api.github.com/repos/Yerexx/MacX-Releases/releases/latest | grep '"tag_name":' | sed -E 's/.*"([^"]+)".*/\1/' | sed 's/v//')

if [ -z "$LATEST_VERSION" ]; then
    echo -e "${RED}Error: Could not fetch latest version info${NC}"
    echo -e "${BLUE}Falling back to direct download...${NC}"
    LATEST_VERSION="1.0.0"
fi

echo -e "${BLUE}Latest version: ${GREEN}v${LATEST_VERSION}${NC}"
echo -e "${BLUE}Downloading MacX v${LATEST_VERSION}...${NC}"

DOWNLOAD_URL="https://github.com/Yerexx/MacX-Releases/raw/master/MacX_Installer.dmg"

if ! curl -L -o "$TEMP_DMG" "$DOWNLOAD_URL" 2>/dev/null; then
    echo -e "${RED}Error: Failed to download MacX v${LATEST_VERSION}${NC}"
    rm -f "$TEMP_DMG" 2>/dev/null
    exit 1
fi

echo -e "${BLUE}Installing MacX v${LATEST_VERSION}...${NC}"

if [ -d "/Applications/MacX.app" ]; then
    sudo rm -rf "/Applications/MacX.app"
fi

hdiutil attach -nobrowse -noautoopen "$TEMP_DMG" > /dev/null
MOUNT_POINT="/Volumes/MacX"

if [ ! -d "$MOUNT_POINT" ]; then
    echo -e "${RED}Error: Failed to mount disk image${NC}"
    rm -f "$TEMP_DMG" 2>/dev/null
    exit 1
fi

if [ ! -d "$MOUNT_POINT/MacX.app" ]; then
    echo -e "${RED}Error: Could not find MacX.app in the mounted image${NC}"
    hdiutil detach "$MOUNT_POINT" >/dev/null 2>&1
    rm -f "$TEMP_DMG" 2>/dev/null
    exit 1
fi

if pgrep -f "MacX" > /dev/null; then
    echo -e "${YELLOW}Closing MacX...${NC}"
    osascript -e 'quit app "MacX"' 2>/dev/null
    sleep 2
fi

if [ -d "/Applications/MacX.app" ]; then
    sudo rm -rf "/Applications/MacX.app"
fi

if sudo /usr/bin/ditto -rsrc "$MOUNT_POINT/MacX.app" "/Applications/MacX.app"; then
    sudo chown -R $(whoami):staff "/Applications/MacX.app"
    sudo chmod -R 755 "/Applications/MacX.app"
    /System/Library/Frameworks/CoreServices.framework/Frameworks/LaunchServices.framework/Support/lsregister -f /Applications/MacX.app
    echo -e "${GREEN}✓ MacX v${LATEST_VERSION} has been installed successfully!${NC}"
else
    echo -e "${RED}Error: Failed to install MacX v${LATEST_VERSION}${NC}"
    hdiutil detach "$MOUNT_POINT" >/dev/null 2>&1
    rm -f "$TEMP_DMG" 2>/dev/null
    exit 1
fi

hdiutil detach "$MOUNT_POINT" >/dev/null 2>&1
rm -f "$TEMP_DMG" 2>/dev/null

echo -e "${BLUE}Launching MacX v${LATEST_VERSION}...${NC}"
open -a "MacX"

echo -e "${GREEN}Installation complete! Enjoy using MacX v${LATEST_VERSION}!${NC}"