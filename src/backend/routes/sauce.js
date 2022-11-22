let express = require('express')
let router = express.Router()
let auth = require('../middleware/auth')
let multer = require('../middleware/multer-config')

let sauceCtrl = require('../controllers/sauce')

router.post('/', auth, multer, sauceCtrl.createSauce)
router.get('/', auth, sauceCtrl.getAllSauces)
router.get('/:id', auth, sauceCtrl.getOneSauce)
router.put('/:id', auth, multer, sauceCtrl.modifySauce)
router.delete('/:id', auth, sauceCtrl.deleteSauce)

router.post('/:id/like', auth, sauceCtrl.likeSauce)

module.exports = router