import { v2 as cloudinary } from 'cloudinary';




async function uploadImageFromBase64(base64Data) {
  cloudinary.config({
    cloud_name: process.env.COLUDINARY_NAME,
    api_key: process.env.COLUDINARY_API_KEY,
    api_secret: process.env.COLUDINARY_API_SECRET
  });
  console.log(process.env.COLUDINARY_NAME, process.env.COLUDINARY_API_SECRET)
  try {
    const result = await cloudinary.uploader.upload(
      base64Data)
    return result;
  } catch (error) {
    console.log(error, "error")
    throw error;
  }
}
export default uploadImageFromBase64;