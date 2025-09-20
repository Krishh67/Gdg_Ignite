# Audio Files for CodeChella Carnival

## Required Files

Place your MP3 files in this directory:

- `countdown.mp3` - Sound to play during the 2-second countdown animation

## File Requirements

- **Format**: MP3
- **Duration**: 2 seconds (to match the countdown animation)
- **Volume**: Normalized to avoid clipping
- **Size**: Keep under 1MB for fast loading

## How to Add Your Audio

1. **Create or find a 2-second audio clip** (countdown sound, beep, chime, etc.)
2. **Convert to MP3 format** if needed
3. **Rename to `countdown.mp3`**
4. **Place in this directory**: `static/audio/countdown.mp3`

## Alternative: Use Online Audio

If you don't have an audio file, you can:
1. Download a free countdown sound from freesound.org
2. Use a text-to-speech generator
3. Record a simple beep or chime
4. Use any 2-second audio clip

## Testing

The audio will automatically play when:
- The page loads and countdown animation starts
- The reset button is clicked
- The game is restarted

## Troubleshooting

If audio doesn't play:
- Check browser console for errors
- Ensure the file is named exactly `countdown.mp3`
- Verify the file is in the correct directory
- Check that the file is not corrupted
- Some browsers require user interaction before playing audio
