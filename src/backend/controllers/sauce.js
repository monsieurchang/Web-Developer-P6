let Sauce = require('../models/Sauce')
let fs = require('fs') //file system

exports.createSauce = (req, res, next) => {
    let sauceObject = JSON.parse(req.body.sauce)
    delete sauceObject._id
    delete sauceObject._userId
    let sauce = new Sauce({
        ...sauceObject, //spread operator = copy elem from req.body
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    })

    sauce.save()
        .then(() => { res.status(201).json({ message: 'Sauce créée !' }) })
        .catch(error => { res.status(400).json({ error }) })
}

exports.modifySauce = (req, res, next) => {
    let sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body }

    delete sauceObject._userId
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            if (sauce.userId != req.auth.userId) {
                res.status(403).json({ message: '403 : unauthorized request.' })
            } else {
                Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Sauce modifiée !' }))
                    .catch(error => res.status(401).json({ error }))
            }
        })
}

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message: 'Non-autorisé' })
            } else {
                let filename = sauce.imageUrl.split('/images/')[1]
                fs.unlink(`images/${filename}`, () => {
                    Sauce.deleteOne({ _id: req.params.id })
                        .then(() => res.status(200).json({ message: 'Sauce supprimée !' }))
                        .catch(error => res.status(401).json({ error }))
                })
            }
        })
        .catch(error => {
            res.status(500).json({ error })
        })
}

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }))
}

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }))
}

exports.likeSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            if (req.body.like === 1) {
                sauce.likes++
                sauce.usersLiked.push(req.body.userId)
            } else if (req.body.like === -1) {
                sauce.dislikes++
                sauce.usersDisliked.push(req.body.userId)
            } else if (req.body.like === 0) {
                if (sauce.usersLiked.includes(req.body.userId)) {
                    sauce.likes--
                    let index = sauce.usersLiked.indexOf(req.body.userId)
                    if (index > -1) { //only splice array when item is found
                        sauce.usersLiked.splice(index, 1) //2nd parameter means remove 1 item only
                    }
                } else if (sauce.usersDisliked.includes(req.body.userId)) {
                    sauce.dislikes--
                    let index = sauce.usersDisliked.indexOf(req.body.userId)
                    if (index > -1) {
                        sauce.usersDisliked.splice(index, 1)
                    }
                }
            }
            sauce.save()
                .then(() => { res.status(201).json({ message: 'Sauce notée !' }) })
                .catch(error => { res.status(400).json({ error }) })
        })
        .catch(error => res.status(400).json({ error }))
}