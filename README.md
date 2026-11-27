# Particular — AI Music Studio

Particular is a planned conversational AI music production studio. Sing or upload a freestyle, analyze its melody and timing, generate an accompaniment that follows the performance, and refine it by talking to an AI producer.

## Architecture
- Frontend: Next.js on Vercel
- Backend: Cloudflare Workers
- Database: Cloudflare D1
- Audio and stems: Cloudflare R2
- AI: speech recognition, melody/tempo analysis, controllable music generation, and voice interaction (providers to be selected and tested)

## Core workflow
1. Record or upload vocals.
2. Analyze pitch, phrase timing, beat grid, and musical key; allow user corrections.
3. Generate accompaniment matched to the original vocal, preserving the vocal take.
4. Preview, revise individual instrument layers, and export stems or mix.

## Status
Project initialized. No deployed app, configured Cloudflare resources, or connected music-generation provider yet. Generated accompaniment fidelity must be validated with real vocal recordings.

## Security
Never commit API keys. Store credentials in Cloudflare/Vercel environment secrets.
