import File from '../models/File';

class BannerUpload {
  async store(req, res) {
    const { originalname: originalName, filename, path } = req.file;

    const file = await File.create({
      originalName,
      filename,
      path,
    });

    return res.json(file);
  }
}

export default new BannerUpload();
