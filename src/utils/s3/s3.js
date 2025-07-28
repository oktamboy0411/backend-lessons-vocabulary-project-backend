const { S3Client, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { Upload } = require("@aws-sdk/lib-storage");
const {
  AWS_ACCESS_KEY_ID,
  AWS_BUCKET_NAME,
  AWS_REGION,
  AWS_SECRET_ACCESS_KEY,
  AWS_URL,
} = require("../secrets/secrets.js");

const customS3Client = new S3Client({
  region: AWS_REGION,
  endpoint: AWS_URL,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

const uploadFileToS3 = async (key, buffer, mimetype) => {
  const upload = new Upload({
    client: customS3Client,
    params: {
      Bucket: AWS_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: mimetype,
    },
  });

  try {
    await upload.done();
    return `${AWS_URL}/${AWS_BUCKET_NAME}/${key}`;
  } catch (error) {
    console.log("Error uploading file to S3:", error);
    return null;
  }
};

const deleteFileFromS3 = async (location) => {
  try {
    const key = location.replace(`${AWS_URL}/${AWS_BUCKET_NAME}/`, "");
    const command = new DeleteObjectCommand({
      Bucket: AWS_BUCKET_NAME,
      Key: key,
    });
    await customS3Client.send(command);
    return true;
  } catch (error) {
    console.error("Error deleting file from S3:", error);
  }
  return false;
};

module.exports = {
  uploadFileToS3,
  deleteFileFromS3,
};
