import { InteractionResponseType } from "discord-interactions";
import { randomNumber } from "../utils";

export function criptografar(req, res) {
  const mensagem = new Enter(req.body.data.options[0].value);
  const output = mensagem.encriptar_descriptar();

  if (output == null) {
    return;
  }

  // Send a message into the channel where command was triggered from
  return res.send({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: `codigo: ${output[0]} \nchave: ${output[1]}`,
    },
  });
}

export function descriptografar(req, res) {
  const mensagem = req.body.data.options[0].value;
  const chave = req.body.data.options[1].value;

  const output = new Enter(mensagem, chave, true);
  const output1 = output.encriptar_descriptar();

  if (output1 == null) {
    return;
  }

  // Send a message into the channel where command was triggered from
  return res.send({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: `mensagem: ${output1}`,
    },
  });
}

const keyboard = ["1234567890", "QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];
const d = "0";
const e = "1";

class Enter {
  constructor(mensagem, key, cripted) {
    this.mensagem = mensagem;
    this.cripted = cripted || false;
    this.key = key || null;
  }

  encriptar_descriptar() {
    const lista = this.create_char_list();
    return this.format(lista);
  }

  create_char_list() {
    const lista = [];
    if (!this.cripted) {
      for (let i = 0; i < this.mensagem.length; i++) {
        if (this.mensagem[i] !== " ") {
          lista.push(new Char(this.mensagem[i], this.key[this.create_random_key], false));
        } else {
          lista.push(new Char(this.mensagem[i], null, false));
        }
      }

      return lista;
    } else {
      let countKey = 0;
      for (let i = 0; i < this.mensagem.length; i++) {
        if (this.mensagem[i] !== " ") {
          lista.push(new Char(this.mensagem[i], this.key[countKey], true));
          countKey++;
        } else {
          lista.push(new Char(this.mensagem[i], true));
        }
      }
      return lista;
    }
  }

  create_random_key() {
    const key = randomNumber(0, 1);
    return key;
  }

  format(charList) {
    let result = "";
    let key = "";

    if (this.cripted) {
      for (const i of charList) {
        if (i.c_tolo !== " ") { result += i.capital ? i.c_tolo : i.c_tolo.toLowerCase(); } else
        if (i.c_tolo === " ") { result += i.c_tolo; }
      }
    }

    if (!this.cripted) {
      for (const i of charList) {
        if (i.c_tolo !== " ") { result += i.capital ? i.c_tolo : i.c_tolo.toLowerCase(); } else
        if (i.c_tolo === " ") { result += i.c_tolo; }

        if (i.individual_key != null) { key += i.individual_key; }
      }
    }

    const output = [result, key];

    if (key !== "") { return output; }
    return result;
  }
}

class Char {
  constructor(c, key = null, cripted = false) {
    this.c = c;
    this.cripted = cripted;
    this.c_tolo = null;
    this.individual_key = key;
    this.alphabet = null;
    this.position = null;

    for (let i = 0; i < keyboard.length; i++) {
      if (this.position == null) {
        this.position = this.findPosition(this.c, keyboard[i]);
        if (this.position !== null) {
          this.alphabet = i;
        }
      }
    }

    if (this.c.toUpperCase() === this.c) {
      this.capital = true;
    } else {
      this.capital = false;
    }

    if (this.c !== " ") {
      if (!this.cripted) {
        this.cifra(keyboard[this.alphabet]);
      } else {
        this.decifra(keyboard[this.alphabet]);
      }
    } else {
      this.c_tolo = " ";
    }
  }

  findPosition(c, lista) {
    for (let i = 0; i < lista.length; i++) {
      if (c.toUpperCase() === lista[i]) {
        return i;
      }
    }
    return null;
  }

  cifra(alphabet) {
    const key = this.individual_key;

    if (this.position !== null) {
      switch (key) {
        case 0:
          this.position = this.position - 1;
          break;
        case 1:
          this.position = this.position + 1;
          break;
      }
      if (this.position === alphabet.length) {
        this.position = 0;
      }
      if (this.position === -1) {
        this.position = alphabet.length - 1;
      }

      this.c_tolo = alphabet[this.position];
    }
  }

  decifra(alphabet) {
    if (this.individual_key !== null) {
      if (this.individual_key === d) {
        this.position = this.position + 1;
      }
      if (this.individual_key === e) {
        this.position = this.position - 1;
      }

      if (this.position === alphabet.length) {
        this.position = 0;
      }
      if (this.position === -1) {
        this.position = alphabet.length - 1;
      }

      this.c_tolo = alphabet[this.position];
      this.individual_key = null;
    }
  }
}
