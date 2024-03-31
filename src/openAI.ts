/*
 * Title:       Sued
 * Version:     Beta
 * Author:      Paulo Muniz
 * GitHub:      https://github.com/paulomunizdev/sued
 * Description: Sued is an AI designed to respond and assist in WhatsApp groups.
 */

import dontenv from 'dotenv';
import OpenAI from 'openai';
dontenv.config();


const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"],
});

  
export async function talkAction(askMessage: string) {
  const chatCompletion = await openai.chat.completions.create({
    messages: [{ role: 'user', content: askMessage }],
    model: 'gpt-3.5-turbo',
  });

  return chatCompletion.choices[0].message.content;


}

