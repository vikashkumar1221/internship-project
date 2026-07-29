const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const fs = require('fs');

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'MOCK_KEY',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'MOCK_SECRET'
  }
});

const uploadFileToS3 = async (filePath, key, mimeType) => {
  try {
    const fileStream = fs.createReadStream(filePath);
    const uploadParams = {
      Bucket: process.env.AWS_S3_BUCKET || 'music-studio-stems-versioned',
      Key: key,
      Body: fileStream,
      ContentType: mimeType
    };

    await s3Client.send(new PutObjectCommand(uploadParams));
    return `https://${process.env.AWS_S3_BUCKET}.s3.amazonaws.com/${key}`;
  } catch (error) {
    console.warn('[S3 Upload Warning] S3 upload error or credentials missing, falling back to local URL:', error.message);
    return `/uploads/${key}`;
  }
};

const getPresignedDownloadUrl = async (key) => {
  try {
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET || 'music-studio-stems-versioned',
      Key: key
    });
    return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  } catch (error) {
    return `/uploads/${key}`;
  }
};

module.exports = { uploadFileToS3, getPresignedDownloadUrl };
