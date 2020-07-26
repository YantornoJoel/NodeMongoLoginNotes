const express = require ('express')
const router = express.Router()
const Note = require('../models/Note')
const { isAuthenticated } = require('../helpers/auth')


router.get('/notes/add', isAuthenticated, (req, res) => {
    res.render('notes/newNotes')
})


router.post('/notes/newNotes', isAuthenticated, async (req, res) =>{
    const {title, description} = req.body;
    const errors =[];
    if(!title){
        errors.push({text: "Por favor ingrese un título"})
    }
    if(!description){
        errors.push({text: "Por favor ingrese una descripción"})
    }
    if(errors.length > 0){
        res.render('notes/newNotes',{
            errors,
            title,
            description
        })
    } else {
        const newNote = new Note ({title, description})
        newNote.user = req.user.id
        await newNote.save()
        req.flash('success_msg', 'Nota Agregada Correctamente')
        res.redirect('/notes')
    }
})

router.get('/notes', isAuthenticated, async(req, res) => {
    await Note.find({user: req.user.id}).sort({date: 'desc'}).then(documentos => {
        const contexto = {
            notes: documentos.map(documento => {
                return{
                    title: documento.title,
                    description: documento.description,
                    _id: documento._id
                }
            })
        }
        res.render('notes/allNotes', {notes: contexto.notes})
    })
})

router.get('/notes/edit/:id', isAuthenticated, async (req, res) =>{
    const note = await Note.findById(req.params.id)
        .then(data => {
            return{
                title: data.title,
                description: data.description,
                id: data.id
            }
        })    
    res.render('notes/editNotes', {note})
})


router.put('/notes/editNotes/:id', isAuthenticated, async(req, res) =>{
    const {title, description} = req.body
    await Note.findByIdAndUpdate(req.params.id, {title, description})
    req.flash('success_msg', 'Nota Actualizada Correctamente')
    res.redirect(('/notes'))
})

router.delete('/notes/delete/:id', isAuthenticated, async(req, res) => {
    await Note.findByIdAndDelete(req.params.id)
    req.flash('success_msg', 'Nota Eliminada Correctamente')
    res.redirect('/notes')
})


module.exports = router