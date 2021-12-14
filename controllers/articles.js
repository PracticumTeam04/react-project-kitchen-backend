const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const {
  ARTICLE_IMAGE_FIELDNAME,
  UPLOAD_FILE_FOLDER,
  HOST,
} = require('../config');
const { upload } = require('../utils/file-uploader');

const createHash = (req, res, next) => {
  if(!req.file) {
    return next();
  }
  try {
    const hash = crypto
      .createHash('sha1')
      .update(req.file.buffer)
      .digest('hex');
    res.locals.fileHash = hash;
    next();
  } catch (error) {
    next(error);
  }
};

const writeFile = (req, res, next) => {
  if(!req.file) {
    return next();
  }
  try {
    const fileName =
      res.locals.fileHash + path.extname(req.file.originalname).toLowerCase();
    delete res.locals.fileHash;
    const uploadPath = __dirname + '/..' + UPLOAD_FILE_FOLDER;
    res.locals.fileUrl = `${HOST}/uploads/${fileName}`;
    const files = fs.readdirSync(uploadPath);
    if (files.includes(fileName)) {
      delete req.file.buffer;
      next();
    } else {
      fs.writeFileSync(`${uploadPath}/${fileName}`, req.file.buffer, 'binary');
      // TODO: clear buffer?
      delete req.file.buffer;
      next();
    }
  } catch (error) {
    next(error);
  }
};

module.exports.saveArticleImage = [
  upload.single(ARTICLE_IMAGE_FIELDNAME),
  createHash,
  writeFile,
];
