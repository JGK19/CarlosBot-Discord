export function criptografar(req, res) {
  console.log('Request no /criptografar:')
  console.log(req.body)
  console.log('vrumvrum')
  console.log(req.body.data.options)
  console.log('vrumvrum')


  // Send a message into the channel where command was triggered from
  return res.send({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
    content: "vrumvrum",
    },
  });
}
