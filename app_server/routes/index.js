const express = require('express');
const router = express.Router();
const ctrlTasks = require('../controllers/tasks');
const ctrlPages = require('../controllers/pages');
const ctrlAuth = require('../controllers/auth');

router.get('/', ctrlTasks.homelist);
// Static pages
router.get('/about', ctrlPages.about);
router.get('/contact', ctrlPages.contact);
router.get('/register', ctrlAuth.showRegister);
router.post('/register', ctrlAuth.register);
router.get('/signin', ctrlAuth.showSignin);
router.post('/signin', ctrlAuth.signin);
router.post('/signout', ctrlAuth.signout);
router.get('/task/add', ctrlTasks.addTaskForm);
router.post('/task/add', ctrlTasks.doAddTask);
router.get('/task/:taskid', ctrlTasks.taskInfo);
router.get('/task/:taskid/edit', ctrlTasks.editTaskForm);
router.post('/task/:taskid/edit', ctrlTasks.doEditTask);
router.post('/task/:taskid/delete', ctrlTasks.doDeleteTask);

module.exports = router;
