module.exports = {
  getProducts: async ({ req, res }) => {
    const Product = getModel("Product");
    const { websiteId } = params;

    let product = await Product.filter({ websiteId: websiteId }).run();
    product = await product.transform(true);

    return res.json(product);
  },
};
