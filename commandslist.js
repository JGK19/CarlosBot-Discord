import { challenge, createCommandChoices } from "./commands/challenge.js";
import { test } from "./commands/test.js";
import { criptografar } from "./commands/cifra_dos_tolos.js"

export const commandslist = [
  {
    body: {
      name: "test",
      description: "Basic guild command",
      type: 1,
    },
    function: test
  },
  {
    body: {
      name: "challenge",
      description: "Challenge to a match of rock paper scissors",
      options: [
        {
          type: 3,
          name: "object",
          description: "Pick your object",
          required: true,
          choices: createCommandChoices(),
        },
      ],
      type: 1,
    },
    function: challenge
  },
  {
    body: {
      name: "criptografar",
      description: "Criptografar uma mensagem usando a Cifra do Tolo",
      options: [
        {
          type: 3,
          name: "frase",
          description: "Frase a ser criptografada",
          required: true,
        }
      ],
      type: 1,
    },
    function: criptografar
  },
]
