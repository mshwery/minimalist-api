/**
 * @overview list route handlers
 */

const express = require('express')

const lists = express.Router()

function getLists (req, res) {

}

function getList (req, res) {

}

function createList (req, res) {

}

function updateList (req, res) {

}

function patchList (req, res) {

}

function deleteList (req, res) {

}

lists.get('/', getLists)
lists.get('/:id', getList)
lists.post('/', createList)
lists.put('/:id', updateList)
lists.patch('/:id', patchList)
lists.delete('/:id', deleteList)

module.exports = lists
