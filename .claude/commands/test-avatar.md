# Test Avatar

Start the local server and open the avatar page for testing.

```bash
# Kill any existing server on port 8083
pkill -f "http.server 8083" 2>/dev/null || true

# Start server
cd /Users/clawdbot/clawd/leonida-face
python3 -m http.server 8083 &

# Wait for server
sleep 2

echo "Server running at:"
echo "  Main:    http://localhost:8083/talkinghead-clawdbot.html"
echo "  Minimal: http://localhost:8083/talkinghead-minimal.html"
echo "  Stipple: http://localhost:8083/stipple-head-gpu.html"
```
