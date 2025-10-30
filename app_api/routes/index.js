const express = require('express');
const router = express.Router();
const ctrlTasks = require('../controllers/tasks');
const ctrlAssets = require('../controllers/assets');

router.get('/tasks', ctrlTasks.tasksList);
router.post('/tasks', ctrlTasks.tasksCreate);
router.get('/tasks/:taskid', ctrlTasks.tasksReadOne);
router.put('/tasks/:taskid', ctrlTasks.tasksUpdateOne);
router.delete('/tasks/:taskid', ctrlTasks.tasksDeleteOne);

// Assets
router.get('/assets', ctrlAssets.assetsList);
router.post('/assets', ctrlAssets.assetsUpload);
router.get('/assets/:assetid', ctrlAssets.assetsReadOne);
router.get('/assets/:assetid/stream', ctrlAssets.assetsStream);
router.delete('/assets/:assetid', ctrlAssets.assetsDeleteOne);

module.exports = router;
