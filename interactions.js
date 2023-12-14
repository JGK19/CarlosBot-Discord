import discord from "discord-interactions";
import * as lists from "./commandslist.js";

/**
 * Handle verification requests
 */
export function ping(req, res) {
  console.log("carlos teste")
  return res.send({ type: discord.InteractionResponseType.PONG });
}

/**
 * Handle slash command requests
 * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
 */
export function applicationcommand(req, res) {
  const { name } = req.body.data;

  lists.commandslist.forEach(element => {
    if (name === element.name) {
      return element.function(req, res);
    }
  });
}

/**
 * Handle requests from interactive components
 * See https://discord.com/developers/docs/interactions/message-components#responding-to-a-component-interaction
 */
export function messagecomponent(req, res) {
  // custom_id set in payload when sending message component
  const componentId = req.body.data.custom_id;

  lists.componentslist.forEach(element => {
    if (componentId.startsWith(element.idprefix)) {
      return element.function(req, res, componentId.replace(element.idprefix, ""));
    }
  });
}
