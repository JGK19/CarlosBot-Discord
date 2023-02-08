import fetch from "node-fetch";
import { verifyKey } from "discord-interactions";

export function VerifyDiscordRequest(clientKey) {
  return function(req, res, buf, encoding) {
    const signature = req.get("X-Signature-Ed25519");
    const timestamp = req.get("X-Signature-Timestamp");

    const isValidRequest = verifyKey(buf, signature, timestamp, clientKey);
    if (!isValidRequest) {
      res.status(401).send("Bad request signature");
      throw new Error("Bad request signature");
    }
  };
}

export async function DiscordRequest(endpoint, options) {
  // append endpoint to root API URL
  const url = "https://discord.com/api/v10/" + endpoint;
  // Stringify payloads
  if (options.body) options.body = JSON.stringify(options.body);
  // Use node-fetch to make requests
  const res = await fetch(url, {
    headers: {
      Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
      "Content-Type": "application/json; charset=UTF-8",
      "User-Agent": "DiscordBot (https://github.com/discord/discord-example-app, 1.0.0)",
    },
    ...options,
  });
  // throw API errors
  if (!res.ok) {
    const data = await res.json();
    console.log(res.status);
    throw new Error(JSON.stringify(data));
  }
  // return original response
  return res;
}

// Simple method that returns a random emoji from list
export function getRandomEmoji() {
  const emojiList = ["😭", "😄", "😌", "🤓", "😎", "😤", "🤖", "😶‍🌫️", "🌏", "📸", "💿", "👋", "🌊", "✨"];
  return emojiList[Math.floor(Math.random() * emojiList.length)];
}

export function countChars(string) {
  let count = 0;
  for (let i = 0; i < string.length; i++) {
    if (string[i] !== " ") {
      count = count + 1;
    }
  }
  return count;
}

export function binaryToBase64(binary) {
  const buffer = Buffer.alloc(1);
  buffer.writeInt8(parseInt(binary, 2), 0);
  return buffer.toString("base64");
}

export function base64ToBinary(base64) {
  const buffer = Buffer.from(base64, "base64");
  const int8 = buffer.readInt8(0);
  return int8.toString(2).padStart(8, "0");
}
