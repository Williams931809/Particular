// Main Cloudflare Worker entrypoint: expose the actual projects and audio API.
// Bind DB (D1), AUDIO (R2), API_TOKEN and ALLOWED_ORIGIN in Cloudflare.
export { default } from './storage';
