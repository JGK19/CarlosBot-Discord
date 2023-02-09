import discord from "discord-interactions";
import * as utils from "../utils.js";

export function main(req, res) {
  // Send a message into the channel where command was triggered from
  return res.send({
    type: discord.InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      // Fetches a random emoji to send from a helper function
      content: "hello world " + utils.getRandomEmoji(),
    },
  });
}
