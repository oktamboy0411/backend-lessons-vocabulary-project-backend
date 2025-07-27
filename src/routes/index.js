const { uploadRouter } = require("./upload/upload.route.js");

const all_routers = [{ path: "/upload", router: uploadRouter }];

module.exports = { all_routers };
