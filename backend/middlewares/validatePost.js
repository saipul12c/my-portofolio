export function validatePost(req, res, next) {
  const { title, slug, category } = req.body;
  if (!title || !slug || !category) {
    return res.status(400).json({ message: "Field title, slug, dan category wajib diisi" });
  }
  next();
}
