const { v4: uuidv4 } = require("uuid");
const router = require("express").Router();
const Comments = require("../src/products/comments.json");

router.get("/", async (req, res) => {
  res.status(200).json(Comments);
});

router.get("/:id", async (req, res) => {
  const idSearch = req.params.id;
  const comments = await Comments.filter(
    (product) => product.id_product === idSearch
  );

  if (!comments) {
    res.status(422).json({ message: "O produto não foi encontrado" });
    return;
  }

  try {
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

module.exports = router;
