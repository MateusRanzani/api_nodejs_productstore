const { v4: uuidv4 } = require("uuid");
const router = require("express").Router();
const AllComments = require("../src/products/comments.json");

router.get("/", async (req, res) => {
  res.status(200).json(AllComments);
});

router.get("/:id", async (req, res) => {
  const idSearch = req.params.id;
  const comments = await AllComments.filter(
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

  const commentArrayFind = await AllComments.findIndex(
    (comment) => comment.id_product === idParam
  );

  if (!user_name || !comment) {
    res.status(422).json({ error: "Preencha todos os campos obrigatórios" });
    return;
  }

  const auxComment = {
    id_product: idParam,
    id: uuidv4(),
    user_name: user_name,
    date: new Date(),
    comment: comment,
  };

  try {
    if (commentArrayFind < 0) {
      AllComments.push({
        id_product: idParam,
        comments: auxComment,
      });
      res.status(201).json({ message: "Comentario inserido com sucesso!" });
      return;
    }

    await AllComments[commentArrayFind].comments.push(auxComment);
    res.status(201).json({ message: "Comentario inserido com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

router.delete("/:id", async (req, res) => {
  const idSearch = req.params.id;
  const idMessage = req.body.id_message;

  const commentDelete = await AllComments.findIndex(
    (comment) => comment.id_product === idSearch
  );

  const filterMessages = await AllComments[commentDelete].comments.filter(
    (comment) => comment.id !== idMessage
  );

  if (commentDelete < 0) {
    res.status(422).json({ message: "Erro ao deletar o comentário" });
    return;
  }

  try {
    AllComments[commentDelete].comments = filterMessages;
    res.status(200).json({ message: "Comentário excluído com sucesso" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

module.exports = router;
