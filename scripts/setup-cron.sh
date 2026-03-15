#!/bin/bash
# ============================================================================
# scripts/setup-cron.sh
# Sets up macOS launchd plist to run backup every 24 hours
# Usage: bash scripts/setup-cron.sh
# ============================================================================

set -e

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.."; pwd)"
SCRIPT_PATH="$PROJECT_DIR/scripts/backup.mjs"
PLIST_LABEL="info.farjadp.backup"
PLIST_PATH="$HOME/Library/LaunchAgents/${PLIST_LABEL}.plist"
LOG_DIR="$HOME/Backups/officialwebsite/logs"
NODE_BIN="$(which node)"

mkdir -p "$LOG_DIR"

echo "📦 Setting up backup cron job..."
echo "   Project : $PROJECT_DIR"
echo "   Script  : $SCRIPT_PATH"
echo "   Node    : $NODE_BIN"
echo "   Log     : $LOG_DIR"
echo ""

cat > "$PLIST_PATH" << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN"
  "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>${PLIST_LABEL}</string>

    <key>ProgramArguments</key>
    <array>
        <string>${NODE_BIN}</string>
        <string>${SCRIPT_PATH}</string>
        <string>full</string>
    </array>

    <!-- Run every 24 hours -->
    <key>StartInterval</key>
    <integer>86400</integer>

    <key>WorkingDirectory</key>
    <string>${PROJECT_DIR}</string>

    <key>EnvironmentVariables</key>
    <dict>
        <key>PATH</key>
        <string>/usr/local/bin:/usr/bin:/bin:/opt/homebrew/bin</string>
    </dict>

    <key>StandardOutPath</key>
    <string>${LOG_DIR}/backup.log</string>

    <key>StandardErrorPath</key>
    <string>${LOG_DIR}/backup-error.log</string>

    <key>RunAtLoad</key>
    <false/>
</dict>
</plist>
EOF

echo "✅ Plist written → $PLIST_PATH"

launchctl unload "$PLIST_PATH" 2>/dev/null || true
launchctl load "$PLIST_PATH"

echo "✅ Backup job loaded into launchd"
echo ""
echo "📋 Commands:"
echo "   Check : launchctl list | grep farjadp"
echo "   Run now : node $SCRIPT_PATH full"
echo "   Logs  : tail -f $LOG_DIR/backup.log"
echo "   Remove: launchctl unload $PLIST_PATH && rm $PLIST_PATH"
echo ""
echo "🕐 First automatic backup in 24 hours."
echo "   Run manually now: node scripts/backup.mjs full"
