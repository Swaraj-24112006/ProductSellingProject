const ImageKit = require("imagekit");
const { v4: uuidv4 } = require("uuid");

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

async function uploadImage({ buffer, fileName, folder = "/product" }) {
  const response = await imagekit.upload({
    file: buffer,                 // ✅ multer buffer
    fileName: fileName || uuidv4(),
    folder,
  });

  return {
    url: response.url,
    thumbnail: response.thumbnailUrl || response.url,
    id: response.fileId,
  };
}

module.exports = { uploadImage };
