/*
 * Title:       Sued
 * Version:     Beta
 * Author:      Paulo Muniz
 * GitHub:      https://github.com/paulomunizdev/sued
 * Description: Sued is an AI designed to respond and assist in WhatsApp groups.
 */

import { connectToWhatsApp } from './baileys.js';

async function main() {
  await connectToWhatsApp();
}

main();
