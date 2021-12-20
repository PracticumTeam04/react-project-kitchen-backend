const crypto = require('crypto');
const fsPromises = require('fs/promises');
const path = require('path');
const { HOST } = require('../config');
const { articleImageUpload } = require('../utils/article-image-uploader');
const UPLOAD_FILE_FOLDER =
  process.env.UPLOAD_FILE_FOLDER || '/usr/src/app/public/uploads';
const ARTICLE_IMAGE_FIELDNAME = 'article-image';

const createHash = (req, res, next) => {
  if (!req.file) {
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
  if (!req.file) {
    return next();
  }

  const fileName =
    res.locals.fileHash + path.extname(req.file.originalname).toLowerCase();
  delete res.locals.fileHash;
  const uploadPath = UPLOAD_FILE_FOLDER;
  res.locals.fileUrl = `${HOST}/uploads/${fileName}`;
  fsPromises
    .readdir(uploadPath)
    .then((files) => {
      if (files.includes(fileName)) {
        delete req.file.buffer;
        next();
      } else {
        fsPromises
          .writeFile(`${uploadPath}/${fileName}`, req.file.buffer, 'binary')
          .then(() => {
            delete req.file.buffer;
            next();
          })
          .catch((error) => {
            delete req.file.buffer;
            throw error;
          });
      }
    })
    .catch((error) => {
      next(error);
    });
};

module.exports.saveArticleImage = [
  articleImageUpload.single(ARTICLE_IMAGE_FIELDNAME),
  createHash,
  writeFile,
];
