const multer = require('multer');
const path = require('path');
const {
  MAX_FILE_FORM_FILES,
  MAX_MULTIPART_FORM_FIELDS,
  MAX_FILE_SIZE,
  ACCEPTED_FILE_TYPES: fileTypesReg,
} = require('../config');

const storage = multer.memoryStorage();

const limits = {
  files: MAX_FILE_FORM_FILES,
  fields: MAX_MULTIPART_FORM_FIELDS,
  fileSize: MAX_FILE_SIZE,
};

const fileFilter = (req, file, cb) => {
  const extname = fileTypesReg.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypesReg.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  }
  return cb(new Error('Переданы неподдерживаемые файлы'));
};

module.exports.upload = multer({
  storage,
  limits,
  fileFilter,
});