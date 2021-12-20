const multer = require('multer');
const path = require('path');

const MAX_FORM_FILES = 1;
const MAX_MULTIPART_FORM_FIELDS = 1;
const MAX_FILE_SIZE = 5e6;
const fileTypesReg = /jpeg|jpg|png|gif/;

const storage = multer.memoryStorage();

const limits = {
  files: MAX_FORM_FILES,
  fields: MAX_MULTIPART_FORM_FIELDS,
  fileSize: MAX_FILE_SIZE,
};

const fileFilter = (req, file, cb) => {
  const extname = fileTypesReg.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = fileTypesReg.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  }
  return cb(new Error('Переданы неподдерживаемые файлы'));
};

module.exports.articleImageUpload = multer({
  storage,
  limits,
  fileFilter,
});
