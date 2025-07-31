const { CategoryRouter } = require("./category/category.route.js");
const { SectionRouter } = require("./section/section.route.js");
const { uploadRouter } = require("./upload/upload.route.js");
const { VocabularyRouter } = require("./vocabulary/vocabulary.route.js");

const all_routers = [
  { path: "/upload", router: uploadRouter },
  { path: "/vocabulary", router: VocabularyRouter },
  { path: "/section", router: SectionRouter },
  { path: "/category", router: CategoryRouter },
];

module.exports = { all_routers };
