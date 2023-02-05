import { InteractionResponseType } from "discord-interactions";

export function criptografar(req, res) {

  let mensagem = req.body.data.options[0].value
  console.log('Request no /criptografar:')
  console.log(req.body)
  console.log('vrumvrum')
  console.log(req.body.data.options)
  console.log(req.body.data.options[0].value)
  console.log('vrumvrum')

  if ( mensagem == null ) {
    mensagem = "vrumvrum"
  }
  console.log(mensagem)

  // Send a message into the channel where command was triggered from
  return res.send({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
    content: mensagem,
    },
  });
}
