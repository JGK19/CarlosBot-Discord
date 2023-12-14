import express from "express";
import * as discord from "discord-interactions";
import * as utils from "./utils.js";
import * as install from "./install.js";
import * as lists from "./commandslist.js";
import * as interactions from "./interactions.js";

// Create an express app
const app = express();
// Parse request body and verifies incoming requests using discord-interactions package
app.use(express.json({ verify: utils.VerifyDiscordRequest(process.env.PUBLIC_KEY) }));

/**
 * Interactions endpoint URL where Discord will send HTTP requests
 */
app.post("/interactions", async function(req, res) {
  // Interaction type and data
  const { type } = req.body;

  console.log(req)
  console.log(req.body)

  if (type === discord.InteractionType.PING) return interactions.ping(req, res);

  if (type === discord.InteractionType.APPLICATION_COMMAND) return interactions.applicationcommand(req, res);

  if (type === discord.InteractionType.MESSAGE_COMPONENT) return interactions.messagecomponent(req, res);
});

app.listen(3000, () => {
  console.log("Listening on port 3000");

  // Check if guild commands from commands.json are installed (if not, install them)
  install.HasGuildCommands(process.env.APP_ID, process.env.GUILD_ID, lists.commandslist);
});
