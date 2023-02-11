import discord from "discord-interactions";
import * as utils from "../utils.js";

export function criptografar(req, res) {
  const mensagem = req.body.data.options[0].value;

  if (req.body.data.options.length !== 2) {
    const enter = new Enter(mensagem);
    enter.createKey(utils.closest8Multiple(enter.numberChars));
    const output = enter.encriptar_descriptar();
    // output[1] = utils.binaryToBase64(output[1]); //

    if (output == null) {
      return;
    }

    // Send a message into the channel where command was triggered from
    return res.send({
      type: discord.InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: `mensagem criptografada: ${output[0]} \nchave da mensagem: ${output[1]}`,
      },
    });
  } else {
    let chave = req.body.data.options[1].value;
    // chave = utils.base64ToBinary(chave); //
    const enter = new Enter(mensagem, chave, false);
    const output = enter.encriptar_descriptar();

    if (output == null) {
      return;
    }

    // Send a message into the channel where command was triggered from
    return res.send({
      type: discord.InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: `mensagem criptografada: ${output}`,
      },
    });
  }
}

export function descriptografar(req, res) {
  const mensagem = req.body.data.options[0].value;
  let chave = req.body.data.options[1].value;
  // chave = utils.base64ToBinary(chave); //

  const output = new Enter(mensagem, chave, true);
  const output1 = output.encriptar_descriptar();

  if (output1 == null) {
    return;
  }

  // Send a message into the channel where command was triggered from
  return res.send({
    type: discord.InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: `mensagem descriptografada: ${output1}`,
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
    this.numberChars = utils.countChars(mensagem);
    if (this.key !== null) {
      this.sizeKey = utils.countChars(key);
    }

    if (this.sizeKey < this.numberChars) {
      const sizeMissing = Math.ceil(this.numberChars - this.sizeKey);

      this.key = this.formatKey(sizeMissing, this.key);
    }
  }

  encriptar_descriptar() {
    const lista = this.create_char_list();
    return this.format(lista);
  }

  create_char_list() {
    const lista = [];
    if (!this.cripted) {
      let countKey = 0;
      for (let i = 0; i < this.mensagem.length; i++) {
        if (this.mensagem[i] !== " ") {
          lista.push(new Char(this.mensagem[i], this.key[countKey], false));
          countKey++;
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
          lista.push(new Char(this.mensagem[i], null, true));
        }
      }
      return lista;
    }
  }

  createKey(x) {
    let finalKey = "";

    for (let i = 0; i < x; i++) {
      const choice = Math.floor(Math.random() * 2);
      let key = null;

      switch (choice) {
        case 0:
          this.position = this.position - 1;
          key = d;
          break;
        case 1:
          this.position = this.position + 1;
          key = e;
          break;
      }
      finalKey = finalKey + key;
    }
    this.key = finalKey;
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

    const output = [result, this.key];
    if (key !== null) { return output; }
    console.log(result);
    return result;
  }

  formatKey(x, key) {
    let result = "";
    for (let i = 0; i < x; i++) {
      result += key;
    }
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
    if (this.individual_key !== null) {
      if (this.individual_key === d) {
        this.position = this.position - 1;
      }
      if (this.individual_key === e) {
        this.position = this.position + 1;
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
