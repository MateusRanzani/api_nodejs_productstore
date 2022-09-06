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

router.post("/:id", async (req, res) => {
  const idParam = req.params.id;
  const { user_name, comment } = req.body;

  const commentArrayFind = await Comments.findIndex(
    (comment) => comment.id_product === idParam
  );

  if (!user_name || !comment) {
    res.status(422).json({ error: "Preencha todos os campos obrigatórios" });
    return;
  }

  const auxComment = {
    user_name: user_name,
    date: new Date(),
    comment: comment,
  };

  try {
    await Comments[commentArrayFind].comments.push(auxComment);
    res
      .status(201)
      .json({ message: "Comentario inserido com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

router.delete("/:id", async (req, res) => {
  const idSearch = req.params.id;

  const commentDelete = await Comments.findIndex(
    (comment) => comment.id_product === idSearch
  );

  if (commentDelete < 0) {
    res.status(422).json({ message: "Erro ao deletar o comentário" });
    return;
  }

  try {
    await Comments.splice(commentDelete, 1);
    res.status(200).json({ message: "Comentário excluído com sucesso" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

module.exports = router;
