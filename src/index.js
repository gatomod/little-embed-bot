/**
 * @name miBot
 * @author Gátomo
 * @description Bot mio
 * @license MIT
 * @version 1.0.0
 */

// @ts-check

// dependencias
const { Client, Intents, MessageEmbed, DiscordAPIError } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const dotenv = require('dotenv');

// dotenv
dotenv.config()

// cliente
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// crear comando
const commands = [
	new SlashCommandBuilder()
		.setName('help')
		.setDescription('Muestra la ayuda del bot'),
	new SlashCommandBuilder()
    .setName('embed')
    .setDescription('Crea un embed')
    .addStringOption(option =>
        option.setName('title')
            .setDescription('Título del embed')
            .setRequired(true)
			)
	.addStringOption(option =>
		option.setName('description')
			.setDescription('Descripción del embed')
			.setRequired(true)
			)
	.addStringOption(option =>
		option.setName('color')
			.setDescription('Color del embed en hexadecimal (por defecto, azul)')
			.setRequired(false)
			)
	.addAttachmentOption(option =>
		option.setName('image')
			.setDescription('Imagen del embed')
			.setRequired(false)
			)
	.addAttachmentOption(option =>
		option.setName('thumbnail')
			.setDescription('Miniatura del embed')
			.setRequired(false)
			)
	.addBooleanOption(option =>
		option.setName('author')
			.setDescription('Autor del embed')
			.setRequired(false)
			)
	.addStringOption(option =>
		option.setName('footer')
			.setDescription('Pie de página del embed')
			.setRequired(false)
			)
	.addBooleanOption(option =>
		option.setName('timestamp')
			.setDescription('Marca de tiempo del embed')
			.setRequired(false)
			)
	.addStringOption(option =>
		option.setName('fieldtitleone')
			.setDescription('Título del primer campo')
			.setRequired(false)
	)
	.addStringOption(option =>
		option.setName('fieldvalueone')
			.setDescription('Texto del primer campo')
			.setRequired(false)
	)
	.addStringOption(option =>
		option.setName('fieldtitletwo')
			.setDescription('Título del segundo campo')
			.setRequired(false)
	)
	.addStringOption(option =>
		option.setName('fieldvaluetwo')
			.setDescription('Texto del segundo campo')
			.setRequired(false)
	)
	.addStringOption(option =>
		option.setName('fieldtitlethree')
			.setDescription('Título del tercer campo')
			.setRequired(false)
	)
	.addStringOption(option =>
		option.setName('fieldvaluethree')
			.setDescription('Texto del tercer campo')
			.setRequired(false)
    )
]
	.map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);

rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), { body: commands })
	.then(() => console.log('Comandos registrados'))
	.catch(console.error);

// evento ready
client.once('ready', () => {
	console.log('Ok, funcionando!');

	const activities = [
		'/help para ayuda'
	]
	setInterval(() => {
		const randomIndex = Math.floor(Math.random() * (activities.length - 1) + 1);
		const newActivity = activities[randomIndex];

		client.user?.setActivity(
			newActivity,
			{
				type: 'WATCHING'
			}
		);
	}, 10000);
});


// evento interactionCreate
client.on('interactionCreate', async interaction => {
	try {
		if (!interaction.isCommand()) return;

		const { commandName, options } = interaction;

		if (commandName === 'embed') {
			if(interaction.memberPermissions.has('ADMINISTRATOR')) {
				const title = options.getString('title');
				const description = options.getString('description');
				const color = options.getString('color');
				const thumbnail = options.getAttachment('thumbnail');
				const image = options.getAttachment('image');
				const author = options.getBoolean('author');
				const footer = options.getString('footer');
				const timestamp = options.getBoolean('timestamp');
				const field1 = options.getString('fieldtitleone');
				const field2 = options.getString('fieldtitletwo');
				const field3 = options.getString('fieldtitlethree');
				const fieldVal1 = options.getString('fieldvalueone');
				const fieldVal2 = options.getString('fieldvaluetwo');
				const fieldVal3 = options.getString('fieldvaluethree');


				const embed = new MessageEmbed()
				
				embed.setTitle(title);
				embed.setDescription(description);
				color ? embed.setColor(`${color}`) : embed.setColor('BLUE');
				if (thumbnail) embed.setThumbnail(thumbnail.attachment);
				if (image) embed.setImage(image.attachment);
				if (author) embed.setAuthor({ name: interaction.member.user.username });
				if (footer) embed.setFooter({ text: footer, iconURL: interaction.guild.iconURL({ dynamic: true }) });
				if (timestamp) embed.setTimestamp();
				if (field1 && fieldVal1) embed.addField(field1, fieldVal1);
				if (field2 && fieldVal2) embed.addField(field2, fieldVal2);
				if (field3 && fieldVal3) embed.addField(field3, fieldVal3);

				return await interaction.reply({
					embeds: [embed]
				})
			} else {
				const embed = new MessageEmbed()
					.setTitle('Error')
					.setDescription('No tienes permisos para ejecutar este comando')
					.setColor('RED');

				return await interaction.reply({
					embeds: [embed],
					ephemeral: true
				})
			}
		} else if (commandName === 'help') {
			const embed = new MessageEmbed()
				.setTitle('Ayuda del bot')
				.setDescription('Para usar el bot, escribe `/embed` y rellena los argumentos que quieras')
				.setColor('BLUE')
				.addField('Argumentos', 'title: Título del embed\ndescription: Descripción del embed\ncolor: Color del embed\nthumbnail: Imagen del embed\nimage: Imagen del embed\nauthor: Autor del embed\nfooter: Pie de página del embed\ntimestamp: Marca de tiempo del embed\nfieldtitleone: Título del primer campo\nfieldtitletwo: Título del segundo campo\nfieldtitlethree: Título del tercer campo\nfieldvalueone: Texto del primer campo\nfieldvaluetwo: Texto del segundo campo\nfieldvaluethree: Texto del tercer campo')
				.addField('Campos', 'Para poner campos, tienes que rellenar `fieldtitle` y `fieldvalue` para que funcione correctamente. Puedes poner un máximo de 3 campos')
				.addField('Agradecimientos','\n**-** Gátomo (programador) - https://discord.gg/E2yBpMq2Km')
				.setTimestamp()

			return await interaction.reply({
				embeds: [embed],
				ephemeral: true
			});
		}
	} catch (err) {
		const embed = MessageEmbed()
			.setTitle('Error')
			.setDescription('Ha ocurrido un error al ejecutar el comando\n' + err)
			.setColor('RED');

		return await interaction.reply({
			embeds: [embed],
			ephemeral: true
		});
	}
});



client.login(process.env.TOKEN);

