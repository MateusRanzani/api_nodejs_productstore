const router = require("express").Router();
const Products = require("../src/products/products.json");
const { v4: uuidv4 } = require("uuid");

router.get("/", async (req, res) => {
  res.status(200).json(Products);
});

router.get("/:id", async (req, res) => {
  const idSearch = req.params.id;
  const product = await Products.filter((product) => product.id === idSearch);

  if (!product) {
    res.status(422).json({ message: "O produto não foi encontrado" });
    return;
  }

  try {
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

router.post("/", async (req, res) => {
  const { name, img, description, value } = req.body;

  if (!name || !description || !value) {
    res.status(422).json({ error: "Preencha todos os campos obrigatórios" });
    return;
  }

  const product = {
    id: uuidv4(),
    name,
    img,
    description,
    value,
  };

  try {
    await Products.push(product);
    res
      .status(201)
      .json({ message: "Pessoa inserida no sistema com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

router.put("/:id", async (req, res) => {
  const idSearch = req.params.id;
  const { name, img, description, value } = req.body;

  const productUpdate = await Products.findIndex(
    (product) => product.id === idSearch
  );
  if (productUpdate < 0) {
    res.status(422).json({ message: "O produto não foi encontrado" });
    return;
  }

  const update = {
    id: Products[productUpdate].id,
    name: name || Products[productUpdate].name,
    img: img || Products[productUpdate].img,
    description: description || Products[productUpdate].description,
    value: value || Products[productUpdate].value,
  };

  try {
    Products[productUpdate] = update;
    res.status(200).json({ message: "Produto atualizado com sucesso" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

router.delete("/:id", async (req, res) => {
  const idSearch = req.params.id;
  const productDelete = await Products.findIndex(
    (product) => product.id === idSearch
  );

  if (productDelete < 0) {
    res.status(422).json({ message: "O produto não foi encontrado" });
    return;
  }

  try {
    await Products.splice(productDelete, 1);
    res.status(200).json({ message: "Produto excluído com sucesso" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

module.exports = router;
