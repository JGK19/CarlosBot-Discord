import express from 'express'
import axios from 'axios';
import { InteractionType, InteractionResponseType } from 'discord-interactions';
import { VerifyDiscordRequest, getRandomEmoji, ComponentType, ButtonStyle, DiscordAPI } from './utils.js';
import { getShuffledOptions, getResult } from './game.js';
import { CHALLENGE_COMMAND, TEST_COMMAND, HasGuildCommands } from './commands.js';

// Create an express app
const app = express();
// Parse request body and verifies incoming requests using discord-interactions package
app.use(express.json({verify: VerifyDiscordRequest(process.env.CLIENT_KEY)}));

// Create HTTP client instance with token
const client = axios.create({
    headers: {'Authorization': `Bot ${process.env.DISCORD_TOKEN}`}
});

// Store for in-progress games. In production, you'd want to use a DB
let activeGames = {};

/**
 * Interactions endpoint URL where Discord will send HTTP requests
 */
app.post('/interaction', function (req, res) {
    // Interaction type and data
    let { type, id, data } = req.body;
    console.log('hi')

    /**
     * Handle verification requests
     */
    if (type === InteractionType.PING) {
        return res.json({ "type": InteractionResponseType.PONG });
    }

    /**
     * Handle slash command requests
     * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
     */
//     if (type === InteractionType.APPLICATION_COMMAND){
//       console.log('here')
//         let { name } = data;
//         // "test" guild command
//         if (name === "test") {
          
//              // Respond to command in channel
//             return res.send({
//                 "type": InteractionResponseType.APPLICATION_MODAL,
//                 "data": {
//                     "custom_id": "my_modal",
//                     "title": "Modal title",
//                     "components": [
//                         {
//                             "type": ComponentType.ACTION,
//                             "components": [
//                                 {
//                                     // See https://discord.com/developers/docs/interactions/message-components#text-inputs-text-input-structure
//                                     "type": ComponentType.INPUT,
//                                     "custom_id": "my_text",
//                                     "style": 1,
//                                     "label": "Type some text"
//                                 },
//                                 {
//                                     // See https://discord.com/developers/docs/interactions/message-components#text-inputs-text-input-structure
//                                     "type": ComponentType.INPUT,
//                                     "custom_id": "my_long_text",
//                                     "style": 2,
//                                     "label": "Type some longer text"
//                                 }
//                             ]

//                         }
//                     ]
//                 }
//             });
//         }
//     }
});

app.listen(3000, () => {
    console.log('Listening on port 3000');

    // Check if guild commands from commands.json are installed (if not, install them)
    //HasGuildCommands(client, process.env.APP_ID, process.env.GUILD_ID, [TEST_COMMAND, CHALLENGE_COMMAND]);
});