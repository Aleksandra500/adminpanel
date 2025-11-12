const express = require('express')
const messageController = require('../controllers/messageController')


const router = express.Router()

router.route('/').get(messageController.getAllMessages)
router.route('/').post(messageController.addMessage)


module.exports = router;