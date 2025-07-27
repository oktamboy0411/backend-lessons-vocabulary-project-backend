class VocabularyController {
  static create = async (req, res, next) => {
    const { type, name, description, image } = req.body;
  };
}
module.exports = { VocabularyController };
