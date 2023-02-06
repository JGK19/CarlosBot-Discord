import { commandslist } from "./commandslist";

/**
 * Handle verification requests
 */
export function ping(req, res) {
  return res.send({ type: InteractionResponseType.PONG });
}

/**
 * Handle slash command requests
 * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
 */
export function applicationcommand(req, res) {
  const { name } = req.body.data;

  commandslist.forEach(element => {
    if (name === element.name) {
      return element.function(req, res)
    }
  });
}

/**
 * Handle requests from interactive components
 * See https://discord.com/developers/docs/interactions/message-components#responding-to-a-component-interaction
 */
export async function messagecomponent(req, res) {
  // custom_id set in payload when sending message component
  const componentId = data.custom_id;

  if (componentId.startsWith("accept_button_")) {
    // get the associated game ID
    const gameId = componentId.replace("accept_button_", "");
    // Delete message with token in request body
    const endpoint = `webhooks/${process.env.APP_ID}/${req.body.token}/messages/${req.body.message.id}`;
    try {
      await res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          // Fetches a random emoji to send from a helper function
          content: "What is your object of choice?",
          // Indicates it'll be an ephemeral message
          flags: InteractionResponseFlags.EPHEMERAL,
          components: [
            {
              type: MessageComponentTypes.ACTION_ROW,
              components: [
                {
                  type: MessageComponentTypes.STRING_SELECT,
                  // Append game ID
                  custom_id: `select_choice_${gameId}`,
                  options: getShuffledOptions(),
                },
              ],
            },
          ],
        },
      });
      // Delete previous message
      await DiscordRequest(endpoint, { method: "DELETE" });
    } catch (err) {
      console.error("Error sending message:", err);
    }
  } else if (componentId.startsWith("select_choice_")) {
    // get the associated game ID
    const gameId = componentId.replace("select_choice_", "");

    if (activeGames[gameId]) {
      // Get user ID and object choice for responding user
      const userId = req.body.member.user.id;
      const objectName = data.values[0];
      // Calculate result from helper function
      const resultStr = getResult(activeGames[gameId], {
        id: userId,
        objectName,
      });

      // Remove game from storage
      delete activeGames[gameId];
      // Update message with token in request body
      const endpoint = `webhooks/${process.env.APP_ID}/${req.body.token}/messages/${req.body.message.id}`;

      try {
        // Send results
        await res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: { content: resultStr },
        });
        // Update ephemeral message
        await DiscordRequest(endpoint, {
          method: "PATCH",
          body: {
            content: "Nice choice " + getRandomEmoji(),
            components: [],
          },
        });
      } catch (err) {
        console.error("Error sending message:", err);
      }
    }
  }
}
