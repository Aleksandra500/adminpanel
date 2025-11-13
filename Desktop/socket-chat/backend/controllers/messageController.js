const MessageModel = require('../models/messageModel');

const getAllMessages = (req, res) => {
	MessageModel.getAllMessages((err, results) => {
		if (err) {
			console.error('Greška pri dohvatanju poruka:', err);
			return res
				.status(500)
				.json({ error: 'Greška pri dohvatanju poruka' });
		}
		res.json(results);
	});
};

const addMessage = (req, res) => {
	const { sender, text } = req.body;

	if (!sender || !text) {
		return res
			.status(400)
			.json({ error: 'Nedostaje sender ili text' });
	}

	MessageModel.addMessage(sender, text, (err, result) => {
		if (err) {
			console.error('Greška pri dodavanju poruke:', err);
			return res
				.status(500)
				.json({ error: 'Greška pri dodavanju poruke' });
		}

		res.status(201).json({
			message: 'Poruka uspešno dodata',
			id: result.insertId,
			sender,
			text,
			timestamp: new Date(),
		});
	});
};

const getPrivateMessages = (req, res) => {
	const { roomId } = req.params;
	MessageModel.getPrivateMessages(roomId, (err, results) => {
		if (err) {
			console.error('Greška pri dohvatanju privatnih poruka:', err);
			return res
				.status(500)
				.json({ error: 'Greška pri dohvatanju privatnih poruka' });
		}
		res.json(results);
	});
};

const addPrivateMessage = (req, res) => {
	const { roomId, sender, receiver, text } = req.body;

	if (!roomId || !sender || !receiver || !text) {
		return res
			.status(400)
			.json({ error: 'Nedostaje roomId, sender, receiver ili text' });
	}

	MessageModel.addPrivateMessage(
		roomId,
		sender,
		receiver,
		text,
		(err, result) => {
			if (err) {
				console.error('Greška pri dodavanju privatne poruke:', err);
				return res
					.status(500)
					.json({ error: 'Greška pri dodavanju privatne poruke' });
			}

			res.status(201).json({
				message: 'Privatna poruka uspešno dodata',
				id: result.insertId,
				roomId,
				sender,
				receiver,
				text,
				timestamp: new Date(),
			});
		}
	);
};

module.exports = {
	getAllMessages,
	addMessage,
	getPrivateMessages,
	addPrivateMessage,
};
