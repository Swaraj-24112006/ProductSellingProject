const ImageKit = require('@imagekit/nodejs');
const { v4: uuidv4 } = require('uuid')
const client = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

async function uploadImage({ buffer, fileName, folder = '/product' }) {
    const response = await client.upload({
        file: buffer,
        fileName: fileName || uuidv4(),
        folder: folder
    });
    return {
        url: response.url,
        thumbnail: response.thumbnailUrl || response.url,
        id: response.fileId
    };
}

module.exports = { uploadImage };