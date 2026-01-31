# Quick Start - Leonida Face Prototype

## Running the Prototype

### Option 1: Python HTTP Server
```bash
cd /Users/clawdbot/clawd/projects/leonida-face
python3 -m http.server 8080
```
Then open: http://localhost:8080

### Option 2: Using npx serve
```bash
npx serve /Users/clawdbot/clawd/projects/leonida-face -p 8080
```

### Option 3: VS Code Live Server
1. Open the folder in VS Code
2. Install "Live Server" extension
3. Right-click index.html → "Open with Live Server"

## What You'll See

1. **Animated Lion Avatar** - Simple CSS-based face with:
   - Blinking eyes
   - Moving mouth when speaking
   - Mood expressions (happy, thinking)

2. **Voice Output** - Click "Test Voice" to hear:
   - Uses Web Speech API by default
   - Can be upgraded to ElevenLabs (set `window.ELEVENLABS_API_KEY`)

3. **Chat Interface** - Basic message display

## To Enable ElevenLabs Voice

In the browser console:
```javascript
window.ELEVENLABS_API_KEY = 'your-api-key-here';
```

Then click "Test Voice" - it will use the Josh voice with eleven_multilingual_v2.

## Next Steps

See README.md for:
- Full TalkingHead integration guide
- Ready Player Me avatar creation
- Tauri desktop app setup
