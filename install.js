import * as utils from "./utils.js";

export async function HasGuildCommands(appId, guildId, commands) {
  if (guildId === "" || appId === "") return;

  commands.forEach((c) => HasGuildCommand(appId, guildId, c));
}

// Checks for a command
async function HasGuildCommand(appId, guildId, command) {
  // API endpoint to get and post guild commands
  const endpoint = `applications/${appId}/guilds/${guildId}/commands`;
  // const endpoint = `applications/${appId}/commands`;

  try {
    const res = await utils.DiscordRequest(endpoint, { method: "GET" });
    const data = await res.json();

    if (data) {
      const installedNames = data.map((c) => c.name);
      // This is just matching on the name, so it's not good for updates
      if (!installedNames.includes(command.name)) {
        console.log(`Installing "${command.name}"`);
        InstallGuildCommand(appId, guildId, command);
      } else {
        console.log(`"${command.name}" command already installed`);
      }
    }
  } catch (err) {
    console.error(err);
  }
}

// Installs a command
export async function InstallGuildCommand(appId, guildId, command) {
  // API endpoint to get and post guild commands
  const endpoint = `applications/${appId}/guilds/${guildId}/commands`;
  // const endpoint = `applications/${appId}/commands`;
  // install command
  try {
    await utils.DiscordRequest(endpoint, { method: "POST", body: command });
  } catch (err) {
    console.error(err);
  }
}
