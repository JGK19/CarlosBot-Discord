import { InteractionResponseType } from "discord-interactions";

export function criptografar(req, res) {

    let mensagem = new Enter(req.body.data.options[0].value)
    let output = mensagem.encriptar_descriptar()

    if (output == null) {
        return
    }
    console.log(output)

    // Send a message into the channel where command was triggered from
    return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
            content: `codigo: ${output[0]} \nchave: ${output[1]}`
        },
    });
}

const keyboard = '1234567890QWERTYUIOPASDFGHJKLZXCVBNM';
const d = '0';
const e = '1';


class Enter {
    constructor(mensagem, key, cripted) {
        this.mensagem = mensagem;
        this.cripted = cripted || false;
        this.key = key || null;
    }

    encriptar_descriptar() {
        let lista = this.create_char_list();
        return this.format(lista);
    }

    create_char_list() {
        let lista = [];
        if (!this.cripted) {
            for (let i = 0; i < this.mensagem.length; i++) {
                lista.push(new Char(this.mensagem[i]));
            }
            return lista;
        } else {
            let count_key = 0;
            for (let i = 0; i < this.mensagem.length; i++) {
                if (this.mensagem[i] !== " ") {
                    lista.push(new Char(this.mensagem[i], true, this.key[count_key]));
                    count_key++;
                } else {
                    lista.push(new Char(this.mensagem[i], true));
                }
            }
            return lista;
        }
    }

    format(char_list) {
        let result = "";
        let key = "";

        if (this.cripted) {
            for (let i of char_list) {
                if (i.c_tolo != " ") {result += i.capital ? i.c_tolo : i.c_tolo.toLowerCase();}
                else { result += i.c_tolo }
            }
        }

        if (!this.cripted) {
            for (let i of char_list) {
                if (i.individual_key != null) {
                    console.log(i.c_tolo, i.c)

                    if (i.c_tolo != " ") {result += i.capital ? i.c_tolo : i.c_tolo.toLowerCase();}
                    else { result += i.c_tolo }

                    if (i.individual_key != null) { key += i.individual_key }
                }
            }
        }

        console.log(result, key)
        let output = [result, key]

        if (key != "") { return output }
        return result


    }
}

class Char {
    constructor(c, key = null, cripted = false) {
        this.c = c;
        this.cripted = cripted;
        this.c_tolo = null;
        this.individual_key = key;

        this.position = this.findPosition(this.c, keyboard);

        if (this.c.toUpperCase() === this.c) {
            this.capital = true;
        } else {
            this.capital = false;
        }

        if (this.c !== " ") {
            if (!this.cripted) {
                this.cifra(keyboard);
            } else {
                this.decifra(keyboard);
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
    }

    cifra(alphabet) {
        const choice = Math.floor(Math.random() * 2);
        let key = null;

        if (this.position !== null) {
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
            if (this.position === keyboard.length) {
                this.position = 0;
            }

            this.c_tolo = alphabet[this.position];
            this.individual_key = key;
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

            this.c_tolo = alphabet[this.position];
            this.individual_key = null;
        }
    }
}
