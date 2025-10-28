const mongoose = require('mongoose');
const multer = require('multer');
const { getGridFSBucket, ObjectId } = require('../models/db');

const Asset = mongoose.model('Asset');

// use memory storage and stream to GridFS
const storage = multer.memoryStorage();
const uploadMiddleware = multer({ storage });

const sendError = (res, status, message, err = null) => {
  console.error(message, err || '');
  return res.status(status).json({ message, error: err ? (err.message || err) : undefined });
};

const assetsList = async (req, res) => {
  try {
    const userId = req.session && req.session.userId;
    if (!userId) return sendError(res, 401, 'Authentication required');
    const docs = await Asset.find({ owner: userId }).sort({ createdAt: -1 }).lean();
    return res.status(200).json(docs);
  } catch (err) { return sendError(res, 500, 'Error fetching assets', err); }
};

// upload handler (expects multipart form-data with field 'file')
const assetsUpload = [
  uploadMiddleware.single('file'),
  async (req, res) => {
    try {
      const userId = req.session && req.session.userId;
      if (!userId) return sendError(res, 401, 'Authentication required');
      if (!req.file) return sendError(res, 400, 'No file uploaded');

      const gfs = getGridFSBucket();
      if (!gfs) return sendError(res, 500, 'GridFS not initialized');

      const uploadStream = gfs.openUploadStream(req.file.originalname, {
        contentType: req.file.mimetype,
        metadata: { owner: userId }
      });

      // write buffer and end
      uploadStream.end(req.file.buffer);

      uploadStream.on('error', err => { return sendError(res, 500, 'Error writing to GridFS', err); });
      uploadStream.on('finish', async (file) => {
        try {
          const assetDoc = await Asset.create({
            filename: file.filename,
            gridFsFileId: file._id,
            mimeType: file.contentType,
            size: file.length,
            owner: userId
          });
          return res.status(201).json(assetDoc);
        } catch (err) { return sendError(res, 500, 'Error creating asset metadata', err); }
      });
    } catch (err) { return sendError(res, 400, 'Upload failed', err); }
  }
];

const assetsReadOne = async (req, res) => {
  try {
    const id = req.params.assetid;
    if (!mongoose.isValidObjectId(id)) return sendError(res, 400, 'Invalid asset id');
    const userId = req.session && req.session.userId;
    if (!userId) return sendError(res, 401, 'Authentication required');
    const doc = await Asset.findOne({ _id: id, owner: userId }).lean();
    if (!doc) return sendError(res, 404, 'Asset not found or not owned by user');
    return res.status(200).json(doc);
  } catch (err) { return sendError(res, 500, 'Error fetching asset', err); }
};

const assetsStream = async (req, res) => {
  try {
    const id = req.params.assetid;
    if (!mongoose.isValidObjectId(id)) return sendError(res, 400, 'Invalid asset id');
    const userId = req.session && req.session.userId;
    if (!userId) return sendError(res, 401, 'Authentication required');
    const doc = await Asset.findOne({ _id: id, owner: userId }).lean();
    if (!doc) return sendError(res, 404, 'Asset not found or not owned by user');

    const gfs = getGridFSBucket();
    if (!gfs) return sendError(res, 500, 'GridFS not initialized');

    res.setHeader('Content-Type', doc.mimeType || 'application/octet-stream');
    res.setHeader('Content-Disposition', `inline; filename="${doc.filename}"`);

    const downloadStream = gfs.openDownloadStream(ObjectId(doc.gridFsFileId));
    downloadStream.on('error', err => { return sendError(res, 404, 'File not found in GridFS', err); });
    downloadStream.pipe(res);
  } catch (err) { return sendError(res, 500, 'Error streaming asset', err); }
};

const assetsDeleteOne = async (req, res) => {
  try {
    const id = req.params.assetid;
    if (!mongoose.isValidObjectId(id)) return sendError(res, 400, 'Invalid asset id');
    const userId = req.session && req.session.userId;
    if (!userId) return sendError(res, 401, 'Authentication required');
    const doc = await Asset.findOne({ _id: id, owner: userId });
    if (!doc) return sendError(res, 404, 'Asset not found or not owned by user');

    const gfs = getGridFSBucket();
    if (!gfs) return sendError(res, 500, 'GridFS not initialized');

    // delete file from GridFS
    await new Promise((resolve, reject) => {
      gfs.delete(ObjectId(doc.gridFsFileId), (err) => {
        if (err) return reject(err);
        return resolve();
      });
    });

    // remove metadata
    await doc.remove();
    return res.status(204).json({ message: 'Asset deleted' });
  } catch (err) { return sendError(res, 500, 'Error deleting asset', err); }
};

module.exports = {
  assetsList,
  assetsUpload,
  assetsReadOne,
  assetsStream,
  assetsDeleteOne,
  uploadMiddleware // in case routes want direct access
};
