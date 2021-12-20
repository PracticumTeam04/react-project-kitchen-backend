const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const {
  HOST,
} = require('../config');
const { articleImageUpload } = require('../utils/article-image-uploader');
const UPLOAD_FILE_FOLDER = process.env.UPLOAD_FILE_FOLDER || '/usr/src/app/public/uploads';
const ARTICLE_IMAGE_FIELDNAME = 'article-image';

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
    const uploadPath = UPLOAD_FILE_FOLDER;
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
  articleImageUpload.single(ARTICLE_IMAGE_FIELDNAME),
  createHash,
  writeFile,
];
