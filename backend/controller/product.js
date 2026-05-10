const uuid = require("uuid");
const { read_file, write_file } = require("../fs/file_system");

// get_all_products
const getAllProducts = async (req, res) => {
  try {
    const products = read_file("products.json");
    res.status(200).json(products);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Get_One_Product
const getOneProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const products = read_file("products.json");
    const foundedProduct = products.find((pro) => pro.id === id);

    if (!foundedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(foundedProduct);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Add_Product
const addProduct = async (req, res) => {
  try {
    const { title, price, quantity } = req.body;
    const products = read_file("products.json");

    products.push({ id: uuid.v4(), title, price, quantity });
    write_file("products.json", products);

    res.status(201).json({ message: "Added new product" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Update_Product
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, price, quantity } = req.body;
    const products = read_file("products.json");

    const foundedProduct = products.find((pro) => pro.id === id);
    if (!foundedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    products.forEach((product) => {
      if (product.id === id) {
        product.title = title ? title : product.title;
        product.price = price ? price : product.price;
        product.quantity = quantity ? quantity : product.quantity;
      }
    });

    write_file("products.json", products);
    res.status(200).json({ message: "Updated product" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Delete_Product
const deleteProducts = async (req, res) => {
  try {
    const { id } = req.params;
    const products = read_file("products.json");

    const foundedProduct = products.find((pro) => pro.id === id);
    if (!foundedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    // BUG FIX: forEach + splice o'rniga filter ishlatildi
    const filteredProducts = products.filter((pro) => pro.id !== id);
    write_file("products.json", filteredProducts);

    res.status(200).json({ message: "Deleted product" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllProducts,
  getOneProduct,
  addProduct,
  deleteProducts,
  updateProduct,
};
