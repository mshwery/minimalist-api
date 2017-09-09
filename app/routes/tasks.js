/**
 * @overview task route handlers
 */

const express = require('express')

const tasks = express.Router()

function getTasks (req, res) {

}

function getTask (req, res) {

}

function createTask (req, res) {

}

function updateTask (req, res) {

}

function patchTask (req, res) {

}

function deleteTask (req, res) {

}

tasks.get('/', getTasks)
tasks.get('/:id', getTask)
tasks.post('/', createTask)
tasks.put('/:id', updateTask)
tasks.patch('/:id', patchTask)
tasks.delete('/:id', deleteTask)

module.exports = tasks
