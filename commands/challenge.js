import discord from "discord-interactions";
import * as utils from "../utils.js";

// Store for in-progress games. In production, you'd want to use a DB
export const activeGames = {};

export function main(req, res) {
  // Interaction type and data
  const { id } = req.body;
  const userId = req.body.member.user.id;
  // User's object choice
  const objectName = req.body.data.options[0].value;

  // Create active game using message ID as the game ID
  activeGames[id] = {
    id: userId,
    objectName,
  };

  return res.send({
    type: discord.InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      // Fetches a random emoji to send from a helper function
      content: `Rock papers scissors challenge from <@${userId}>`,
      components: [
        {
          type: discord.MessageComponentTypes.ACTION_ROW,
          components: [
            {
              type: discord.MessageComponentTypes.BUTTON,
              // Append the game ID to use later on
              custom_id: `accept_button_${req.body.id}`,
              label: "Accept",
              style: discord.ButtonStyleTypes.PRIMARY,
            },
          ],
        },
      ],
    },
  });
}

// Get the game choices from game.js
export function createCommandChoices() {
  const choices = getRPSChoices();
  const commandChoices = [];

  for (const choice of choices) {
    commandChoices.push({
      name: capitalize(choice),
      value: choice.toLowerCase(),
    });
  }

  return commandChoices;
}

export function getResult(p1, p2) {
  let gameResult;
  if (RPSChoices[p1.objectName] && RPSChoices[p1.objectName][p2.objectName]) {
    // o1 wins
    gameResult = {
      win: p1,
      lose: p2,
      verb: RPSChoices[p1.objectName][p2.objectName],
    };
  } else if (
    RPSChoices[p2.objectName] &&
    RPSChoices[p2.objectName][p1.objectName]
  ) {
    // o2 wins
    gameResult = {
      win: p2,
      lose: p1,
      verb: RPSChoices[p2.objectName][p1.objectName],
    };
  } else {
    // tie -- win/lose don't
    gameResult = { win: p1, lose: p2, verb: "tie" };
  }

  return formatResult(gameResult);
}

function formatResult(result) {
  const { win, lose, verb } = result;
  return verb === "tie"
    ? `<@${win.id}> and <@${lose.id}> draw with **${win.objectName}**`
    : `<@${win.id}>'s **${win.objectName}** ${verb} <@${lose.id}>'s **${lose.objectName}**`;
}

// this is just to figure out winner + verb
const RPSChoices = {
  rock: {
    description: "sedimentary, igneous, or perhaps even metamorphic",
    virus: "outwaits",
    computer: "smashes",
    scissors: "crushes",
  },
  cowboy: {
    description: "yeehaw~",
    scissors: "puts away",
    wumpus: "lassos",
    rock: "steel-toe kicks",
  },
  scissors: {
    description: "careful ! sharp ! edges !!",
    paper: "cuts",
    computer: "cuts cord of",
    virus: "cuts DNA of",
  },
  virus: {
    description: "genetic mutation, malware, or something inbetween",
    cowboy: "infects",
    computer: "corrupts",
    wumpus: "infects",
  },
  computer: {
    description: "beep boop beep bzzrrhggggg",
    cowboy: "overwhelms",
    paper: "uninstalls firmware for",
    wumpus: "deletes assets for",
  },
  wumpus: {
    description: "the purple Discord fella",
    paper: "draws picture on",
    rock: "paints cute face on",
    scissors: "admires own reflection in",
  },
  paper: {
    description: "versatile and iconic",
    virus: "ignores",
    cowboy: "gives papercut to",
    rock: "covers",
  },
};

export function getRPSChoices() {
  return Object.keys(RPSChoices);
}

// Function to fetch shuffled options for select menu
export function getShuffledOptions() {
  const allChoices = getRPSChoices();
  const options = [];

  for (const c of allChoices) {
    // Formatted for select menus
    // https://discord.com/developers/docs/interactions/message-components#select-menu-object-select-option-structure
    options.push({
      label: capitalize(c),
      value: c.toLowerCase(),
      description: RPSChoices[c].description,
    });
  }

  return options.sort(() => Math.random() - 0.5);
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export async function acceptbutton(req, res, gameId) {
  // Delete message with token in request body
  const endpoint = `webhooks/${process.env.APP_ID}/${req.body.token}/messages/${req.body.message.id}`;
  try {
    await res.send({
      type: discord.InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: "What is your object of choice?",
        // Indicates it'll be an ephemeral message
        flags: discord.InteractionResponseFlags.EPHEMERAL,
        components: [
          {
            type: discord.MessageComponentTypes.ACTION_ROW,
            components: [
              {
                type: discord.MessageComponentTypes.STRING_SELECT,
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
    await utils.DiscordRequest(endpoint, { method: "DELETE" });
  } catch (err) {
    console.error("Error sending message:", err);
  }
}

export async function selectchoice(req, res, gameId) {
  if (activeGames[gameId]) {
    // Get user ID and object choice for responding user
    const userId = req.body.member.user.id;
    const objectName = req.body.data.values[0];
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
        type: discord.InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: { content: resultStr },
      });
      // Update ephemeral message
      await utils.DiscordRequest(endpoint, {
        method: "PATCH",
        body: {
          content: "Nice choice " + utils.getRandomEmoji(),
          components: [],
        },
      });
    } catch (err) {
      console.error("Error sending message:", err);
    }
  }
}
