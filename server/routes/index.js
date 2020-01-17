const router = require('express').Router()

const usersRouter = require('./users')
const countRouter = require('./home/count')
const rankingRouter = require('./home/ranking')

router.use('/users', usersRouter)
router.use('/count', countRouter)
router.use('/ranking', rankingRouter)
router.use('/message', require('./message'))
router.use('/geo', require('./home/geo'))
router.use('/member', require('./member'))
router.use('/common', require('./common'))

module.exports = router
