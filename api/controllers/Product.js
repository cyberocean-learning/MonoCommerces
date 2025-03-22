module.exports = {
  getProducts: async ({ req , res }) => {
    const Product = getModel('Product');

    let product = await Product.all();
    product = await product.transform(true);

    return res.json(product)
  }
}