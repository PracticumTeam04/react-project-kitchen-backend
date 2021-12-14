module.exports = {
  secret: process.env.NODE_ENV === 'production' ? process.env.SECRET : 'secret',
  HOST: process.env.NODE_ENV === 'production' ? process.env.HOST : 'http://localhost:3000',
  UPLOAD_FILE_FOLDER: process.env.UPLOAD_FILE_FOLDER ? process.env.UPLOAD_FILE_FOLDER : '/public/uploads',
  ARTICLE_IMAGE_FIELDNAME: 'article-image',
  MAX_FILE_FORM_FILES: 1,
  MAX_MULTIPART_FORM_FIELDS: 10,
  MAX_FILE_SIZE: 5E6,
  ACCEPTED_FILE_TYPES: /jpeg|jpg|png|gif/,
};
