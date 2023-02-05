import { InteractionResponseType } from "discord-interactions";

export function criptografar(req, res) {

  let mensagem = req.body.data.options[0].value

  if ( mensagem == null ) {
    mensagem = "manda alguma mensagem ai parceiro"
  }

  // Send a message into the channel where command was triggered from
  return res.send({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
    content: mensagem,
    },
  });
}
