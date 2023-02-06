import express from "express";
import {
  InteractionType,
  InteractionResponseType,
  InteractionResponseFlags,
  MessageComponentTypes,
} from "discord-interactions";
import {
  VerifyDiscordRequest,
  DiscordRequest,
  getRandomEmoji,
} from "./utils.js";
import { HasGuildCommands } from "./install.js";
import { commandslist } from "./commandslist.js";
import { applicationcommand, messagecomponent, ping } from "./interactions.js";

// Create an express app
const app = express();
// Parse request body and verifies incoming requests using discord-interactions package
app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }));

/**
 * Interactions endpoint URL where Discord will send HTTP requests
 */
app.post("/interactions", async function (req, res) {
  // Interaction type and data
  const { type, id, data } = req.body;

  if (type === InteractionType.PING) return ping(req, res)

  if (type === InteractionType.APPLICATION_COMMAND) return applicationcommand(req, res)

  if (type === InteractionType.MESSAGE_COMPONENT) return messagecomponent(req, res)
});

app.listen(3000, () => {
  console.log("Listening on port 3000");

  // Check if guild commands from commands.json are installed (if not, install them)
  HasGuildCommands(process.env.APP_ID, process.env.GUILD_ID, commandslist);
});
