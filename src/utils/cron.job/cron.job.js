const cron = require("node-cron");
const {
  UploadController,
} = require("../../controllers/upload/upload.controller.js");

cron.schedule("00 17 * * *", async () => {
  const deletedCount = await UploadController.deleteFilesWithCron();
  console.log(`Deleted ${deletedCount} old files`);
});
