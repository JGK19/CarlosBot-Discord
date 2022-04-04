# Getting Started app for Discord

This project contains a basic rock-paper-scissors-style Discord app written in JavaScript, built for the [getting started guide](TODO).

A version of this code is also hosted [on Glitch](https://glitch.com/edit/#!/getting-started-discord).

## Project structure
Below is a basic overview of the project structure:

```
├── examples    -> short, feature-specific sample apps
│   ├── button.js
│   ├── command.js
│   ├── modal.js
│   ├── selectMenu.js
├── .env.sample -> sample .env file
├── app.js      -> main entrypoint for app
├── commands.js -> slash command payloads + helpers
├── game.js     -> logic specific to RPS
├── utils.js    -> utility functions and enums
├── package.json
├── README.md
└── .gitignore
```

## Running app locally

Before you start, you'll need to [create a Discord app](https://discord.com/developers/applications) with the proper permissions:
- `applications.commands`
- `bot` (with Send Messages and Use Slash Commands enabled)

Configuring the app is covered in detail in [the getting started guide](TODO).
### Setup project

First clone the project:
```
git clone https://github.com/shaydewael/discord-getting-started.git
```

Then navigate to its directory and install dependencies:
```
cd discord-getting-started
npm install
```
### Get app credentials

Fetch the credentials from your app's settings and add them to a `.env` file (see `.env.sample` for an example). You'll need your app ID (`APP_ID`), server ID (`GUILD_ID`), bot token (`DISCORD_TOKEN`), and public key (`PUBLIC_KEY`).

Fetching credentials is covered in detail in [the getting started guide](TODO).





then install the dependencies:




## Other resources
- Join the **[Discord Developers server](https://discord.gg/discord-developers)** to ask questions about the API, attend events hosted by the Discord API team, and interact with other devs.
- Read **[the documentation](https://discord.com/developers/docs/intro)** for in-depth information about API features.
- Check out **[community resources](https://discord.com/developers/docs/topics/community-resources#community-resources)** for language-specific tools maintained by community members.



