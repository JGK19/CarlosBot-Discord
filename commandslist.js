import * as challenge from "./commands/challenge.js";
import * as test from "./commands/test.js";
import * as cifraDosTolos from "./commands/cifraDosTolos.js";

export const commandslist = [
  {
    name: "test",
    description: "Basic guild command",
    type: 1,
    function: test.main,
  },
  {
    name: "challenge",
    description: "Challenge to a match of rock paper scissors",
    options: [
      {
        type: 3,
        name: "object",
        description: "Pick your object",
        required: true,
        choices: challenge.createCommandChoices(),
      },
    ],
    type: 1,
    function: challenge.main,
  },
  {
    name: "criptografar",
    description: "Criptografar uma mensagem usando a Cifra dos Tolos",
    options: [
      {
        type: 3,
        name: "frase",
        description: "Frase a ser criptografada",
        required: true,
      },
      {
        type: 3,
        name: "chave",
        description: "Chave para criptografar",
        required: false,
      },
      {
        type: 3,
        name: "secreto",
        description: "se sim a resposta só sera visivel para vc",
        required: false,
        choices: [
          {
            name: "sim",
            value: "sim",
          },
          {
            name: "não",
            value: "não",
          },
        ],
      },
    ],
    type: 1,
    function: cifraDosTolos.criptografar,
  },
  {
    name: "descriptografar",
    description: "Descriptografar uma mensagem usando a Cifra dos Tolos",
    options: [
      {
        type: 3,
        name: "frase",
        description: "Frase a ser descriptografada",
        required: true,
      },
      {
        type: 3,
        name: "chave",
        description: "Chave para descriptografar",
        required: true,
      },
      {
        type: 3,
        name: "secreto",
        description: "se sim a resposta só sera visivel para vc",
        required: false,
        choices: [
          {
            name: "sim",
            value: "sim",
          },
          {
            name: "não",
            value: "não",
          },
        ],
      },
    ],

    type: 1,
    function: cifraDosTolos.descriptografar,
  },
];

export const componentslist = [
  {
    idprefix: "accept_button_",
    function: challenge.acceptbutton,
  },
  {
    idprefix: "select_choice_",
    function: challenge.selectchoice,
  },
];
