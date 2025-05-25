const { createUploadthing } = require("uploadthing/server");

const f = createUploadthing();

const uploadRouter = {
  pdfUploader: f({ pdf: { maxFileSize: "10MB" } })
    .middleware(async (req) => {
      const user = req.user;

      if (!user) throw new Error("Unauthorized");

      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("File URL:", file.url);

      return { uploadedBy: metadata.userId, url: file.url };
    }),
};

module.exports = uploadRouter; 