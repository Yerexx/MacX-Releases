#!/bin/bash

# MacX Installer Script
# Usage: bash -c "$(curl -fsSL https://raw.githubusercontent.com/YourUsername/MacX-Distribution/main/install.sh)"

RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
PURPLE='\033[0;35m'
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

# Check if running on macOS
if [[ "$(uname)" != "Darwin" ]]; then
    echo -e "${RED}Error: This installer is only for macOS systems${NC}"
    exit 1
fi

# Check if curl is available
if ! command -v curl &> /dev/null; then
    echo -e "${RED}Error: curl is not installed${NC}"
    exit 1
fi

# Request admin privileges
echo -e "${YELLOW}Administrator access is required for installation. Please enter your password.${NC}"
if ! sudo -v; then
    echo -e "${RED}Error: Failed to obtain administrator privileges${NC}"
    exit 1
fi

echo -e "${BLUE}Checking for latest version...${NC}"

# Get latest release info from GitHub API
LATEST_RELEASE=$(curl -s https://api.github.com/repos/YourUsername/MacX-Distribution/releases/latest)
LATEST_VERSION=$(echo "$LATEST_RELEASE" | grep '"tag_name":' | sed -E 's/.*"([^"]+)".*/\1/')
DOWNLOAD_URL=$(echo "$LATEST_RELEASE" | grep '"browser_download_url":.*\.dmg"' | sed -E 's/.*"([^"]+)".*/\1/')

if [ -z "$LATEST_VERSION" ] || [ -z "$DOWNLOAD_URL" ]; then
    echo -e "${RED}Error: Could not fetch latest version info${NC}"
    echo -e "${YELLOW}Falling back to direct download...${NC}"
    LATEST_VERSION="v1.0.0"
    DOWNLOAD_URL="https://github.com/YourUsername/MacX-Distribution/releases/download/v1.0.0/MacX_Installer.dmg"
fi

echo -e "${BLUE}Latest version: ${GREEN}${LATEST_VERSION}${NC}"
echo -e "${BLUE}Downloading MacX ${LATEST_VERSION}...${NC}"

# Create temporary file for download
TEMP_DMG=$(mktemp)

# Download the DMG file
if ! curl -L -o "$TEMP_DMG" "$DOWNLOAD_URL" 2>/dev/null; then
    echo -e "${RED}Error: Failed to download MacX ${LATEST_VERSION}${NC}"
    rm -f "$TEMP_DMG" 2>/dev/null
    exit 1
fi

echo -e "${BLUE}Installing MacX ${LATEST_VERSION}...${NC}"

# Close MacX if it's running
if pgrep -f "MacX" > /dev/null; then
    echo -e "${YELLOW}Closing MacX...${NC}"
    osascript -e 'quit app "MacX"' 2>/dev/null
    sleep 2
fi

# Remove existing installation
if [ -d "/Applications/MacX.app" ]; then
    echo -e "${YELLOW}Removing existing installation...${NC}"
    sudo rm -rf "/Applications/MacX.app"
fi

# Mount the DMG
hdiutil attach -nobrowse -noautoopen "$TEMP_DMG" > /dev/null
MOUNT_POINT="/Volumes/MacX"

# Check if mount was successful
if [ ! -d "$MOUNT_POINT" ]; then
    echo -e "${RED}Error: Failed to mount disk image${NC}"
    rm -f "$TEMP_DMG" 2>/dev/null
    exit 1
fi

# Check if MacX.app exists in the mounted image
if [ ! -d "$MOUNT_POINT/MacX.app" ]; then
    echo -e "${RED}Error: Could not find MacX.app in the mounted image${NC}"
    hdiutil detach "$MOUNT_POINT" >/dev/null 2>&1
    rm -f "$TEMP_DMG" 2>/dev/null
    exit 1
fi

# Copy MacX.app to Applications
if sudo /usr/bin/ditto -rsrc "$MOUNT_POINT/MacX.app" "/Applications/MacX.app"; then
    # Set proper ownership and permissions
    sudo chown -R $(whoami):staff "/Applications/MacX.app"
    sudo chmod -R 755 "/Applications/MacX.app"
    
    # Register the app with Launch Services
    /System/Library/Frameworks/CoreServices.framework/Frameworks/LaunchServices.framework/Support/lsregister -f /Applications/MacX.app
    
    echo -e "${GREEN}✓ MacX ${LATEST_VERSION} has been installed successfully!${NC}"
else
    echo -e "${RED}Error: Failed to install MacX ${LATEST_VERSION}${NC}"
    hdiutil detach "$MOUNT_POINT" >/dev/null 2>&1
    rm -f "$TEMP_DMG" 2>/dev/null
    exit 1
fi

# Cleanup
hdiutil detach "$MOUNT_POINT" >/dev/null 2>&1
rm -f "$TEMP_DMG" 2>/dev/null

# Launch MacX
echo -e "${BLUE}Launching MacX ${LATEST_VERSION}...${NC}"
open -a "MacX"

echo -e "${GREEN}🎉 Installation complete! Enjoy using MacX ${LATEST_VERSION}!${NC}"
echo -e "${PURPLE}💡 Tip: Press ⌘, to open preferences and customize your editor${NC}"
echo -e "${BLUE}📚 Documentation: https://github.com/YourUsername/MacX-Distribution${NC}"