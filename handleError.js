function handleErrorAndReply(err, interaction, createEmbed) {
    console.log(err);
    const embed = createEmbed("Red", "⛔ | 먼가.. 잘못됬는데..?");
    return interaction.reply({ embeds: [embed], ephemeral: true });
  }
  
  module.exports = handleErrorAndReply;