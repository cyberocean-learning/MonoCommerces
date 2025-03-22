# CyberOcean Framework: Advanced Controller Function Creation Guide

This comprehensive guide will help you create powerful controller functions in the CyberOcean framework, with a focus on CRUD operations, search functionality, and complex data manipulation.

## Table of Contents

1. [CRUD Operations]
    - [Create Functions]
    - [Read Functions]
    - [Update Functions]
    - [Delete Functions]
2. [Search and Filtering]
3. [Collection Management]
4. [Product Management]
5. [Advanced Patterns]
6. [Complete Examples]

---

## CRUD Operations

### Create Functions

Creating new records in the database is a common operation. Here's how to implement it effectively:

### Basic Create Function

```jsx
module.exports = {
  createProduct: async ({ req, res }) => {
    try {
      // Get the model
      const Product = req.getModel("Product");

      // Validate required fields
      if (!req.body.title || !req.body.price) {
        return res.status(400).json({
          success: false,
          error: "Title and price are required"
        });
      }

      // Create new product
      const product = Product.new({
        title: req.body.title,
        description: req.body.description || "",
        price: parseFloat(req.body.price),
        _price: parseFloat(req.body.price), // For sorting
        collectionsKeys: req.body.collectionsKeys || [],
        tags: req.body.tags || [],
        available: req.body.available !== false,
        created_at: new Date().getTime(),
        updated_at: new Date().getTime()
      });

      // Save product
      await product.save();

      // Transform to JSON
      const transformedProduct = await product.transform(true);

      return res.json({
        success: true,
        message: "Product created successfully",
        product: transformedProduct
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
};

```

### Advanced Create Function with Relationships

```jsx
module.exports = {
  createArticleWithTags: async ({ req, res }) => {
    try {
      // Get models
      const Article = req.getModel("Article");
      const Tag = req.getModel("Tag");

      // Validate required fields
      if (!req.body.title || !req.body.content) {
        return res.status(400).json({
          success: false,
          error: "Title and content are required"
        });
      }

      // Process tags
      const tagNames = req.body.tags || [];
      const tagIds = [];

      // Create tags that don't exist
      for (const tagName of tagNames) {
        let tag = await Tag.filter({ name: tagName }).first();

        if (!tag) {
          tag = Tag.new({
            name: tagName,
            created_at: new Date().getTime()
          });
          await tag.save();
        }

        tagIds.push(tag.id);
      }

      // Create article
      const article = Article.new({
        title: req.body.title,
        content: req.body.content,
        tagIds: tagIds,
        authorId: req.user.id,
        published: req.body.published === true,
        views: 0,
        created_at: new Date().getTime(),
        updated_at: new Date().getTime()
      });

      await article.save();

      // Transform to JSON with related data
      const transformedArticle = await article.transform(true);

      return res.json({
        success: true,
        message: "Article created successfully",
        article: transformedArticle
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
};

```

### Read Functions

Reading data from the database can range from simple to complex operations:

### Get Single Item

```jsx
module.exports = {
  getProduct: async ({ req, res }) => {
    try {
      const { product_id } = params;
      const Product = req.getModel("Product");

      // Find product by ID
      const product = await Product.find(product_id);

      if (!product) {
        return res.status(404).json({
          success: false,
          error: "Product not found"
        });
      }

      // Transform to JSON
      const transformedProduct = await product.transform(true);

      return res.json({
        success: true,
        product: transformedProduct
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
};

```

### Get List with Pagination

```jsx
module.exports = {
  listProducts: async ({ req, res }) => {
    try {
      const Product = req.getModel("Product");

      // Pagination parameters
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const skip = (page - 1) * limit;

      // Sorting parameters
      const sortField = req.query.sort_field || "created_at";
      const sortOrder = req.query.sort_order || "desc";

      // Execute query
      const products = await Product.orderBy(sortField, sortOrder)
        .skip(skip)
        .limit(limit)
        .run();

      // Get total count for pagination
      const totalCount = await Product.count();

      // Transform to JSON
      const transformedProducts = await products.transform(true);

      return res.json({
        success: true,
        products: transformedProducts,
        pagination: {
          total: totalCount,
          page: page,
          limit: limit,
          pages: Math.ceil(totalCount / limit)
        }
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
};

```

### Get Item with Related Data

```jsx
module.exports = {
  getArticleWithComments: async ({ req, res }) => {
    try {
      const { article_id } = params;
      const Article = req.getModel("Article");
      const Comment = req.getModel("Comment");

      // Find article
      const article = await Article.find(article_id);

      if (!article) {
        return res.status(404).json({
          success: false,
          error: "Article not found"
        });
      }

      // Find comments for this article
      const comments = await Comment.filter({ articleId: article_id })
        .orderBy("created_at", "desc")
        .run();

      // Transform to JSON
      const transformedArticle = await article.transform(true);
      const transformedComments = await comments.transform(true);

      // Increment view count
      article.views = (article.views || 0) + 1;
      await article.save();

      return res.json({
        success: true,
        article: transformedArticle,
        comments: transformedComments
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
};

```

### Update Functions

Updating existing records requires careful validation and error handling:

### Basic Update Function

```jsx
module.exports = {
  updateProduct: async ({ req, res }) => {
    try {
      const { product_id } = params;
      const Product = req.getModel("Product");

      // Find product
      const product = await Product.find(product_id);

      if (!product) {
        return res.status(404).json({
          success: false,
          error: "Product not found"
        });
      }

      // Update fields
      if (req.body.title !== undefined) product.title = req.body.title;
      if (req.body.description !== undefined) product.description = req.body.description;
      if (req.body.price !== undefined) {
        product.price = parseFloat(req.body.price);
        product._price = parseFloat(req.body.price); // For sorting
      }
      if (req.body.collectionsKeys !== undefined) product.collectionsKeys = req.body.collectionsKeys;
      if (req.body.tags !== undefined) product.tags = req.body.tags;
      if (req.body.available !== undefined) product.available = req.body.available;

      // Update timestamp
      product.updated_at = new Date().getTime();

      // Save changes
      await product.save();

      // Transform to JSON
      const transformedProduct = await product.transform(true);

      return res.json({
        success: true,
        message: "Product updated successfully",
        product: transformedProduct
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
};

```

### Partial Update (PATCH) Function

```jsx
module.exports = {
  patchProduct: async ({ req, res }) => {
    try {
      const { product_id } = params;
      const Product = req.getModel("Product");

      // Find product
      const product = await Product.find(product_id);

      if (!product) {
        return res.status(404).json({
          success: false,
          error: "Product not found"
        });
      }

      // Update only provided fields
      const allowedFields = ['title', 'description', 'price', 'collectionsKeys', 'tags', 'available'];
      let updated = false;

      for (const field of allowedFields) {
        if (req.body[field] !== undefined) {
          if (field === 'price') {
            product[field] = parseFloat(req.body[field]);
            product._price = parseFloat(req.body[field]); // For sorting
          } else {
            product[field] = req.body[field];
          }
          updated = true;
        }
      }

      if (updated) {
        // Update timestamp
        product.updated_at = new Date().getTime();

        // Save changes
        await product.save();
      }

      // Transform to JSON
      const transformedProduct = await product.transform(true);

      return res.json({
        success: true,
        message: updated ? "Product updated successfully" : "No changes applied",
        product: transformedProduct
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
};

```

### Bulk Update Function

```jsx
module.exports = {
  bulkUpdateProducts: async ({ req, res }) => {
    try {
      // Validate input
      if (!req.body.products || !Array.isArray(req.body.products)) {
        return res.status(400).json({
          success: false,
          error: "Products array is required"
        });
      }

      const Product = req.getModel("Product");
      const results = {
        success: [],
        failed: []
      };

      // Process each product update
      for (const productUpdate of req.body.products) {
        try {
          if (!productUpdate.id) {
            results.failed.push({
              data: productUpdate,
              error: "Product ID is required"
            });
            continue;
          }

          // Find product
          const product = await Product.find(productUpdate.id);

          if (!product) {
            results.failed.push({
              id: productUpdate.id,
              error: "Product not found"
            });
            continue;
          }

          // Update fields
          const allowedFields = ['title', 'description', 'price', 'collectionsKeys', 'tags', 'available'];
          let updated = false;

          for (const field of allowedFields) {
            if (productUpdate[field] !== undefined) {
              if (field === 'price') {
                product[field] = parseFloat(productUpdate[field]);
                product._price = parseFloat(productUpdate[field]); // For sorting
              } else {
                product[field] = productUpdate[field];
              }
              updated = true;
            }
          }

          if (updated) {
            // Update timestamp
            product.updated_at = new Date().getTime();

            // Save changes
            await product.save();
          }

          // Transform to JSON
          const transformedProduct = await product.transform(true);

          results.success.push({
            id: productUpdate.id,
            product: transformedProduct
          });
        } catch (error) {
          results.failed.push({
            id: productUpdate.id,
            error: error.message
          });
        }
      }

      return res.json({
        success: true,
        message: `Updated ${results.success.length} products, failed ${results.failed.length} products`,
        results: results
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
};

```

### Delete Functions

Deleting records requires careful validation to prevent accidental data loss:

### Basic Delete Function

```jsx
module.exports = {
  deleteProduct: async ({ req, res }) => {
    try {
      const { product_id } = params;
      const Product = req.getModel("Product");

      // Find product
      const product = await Product.find(product_id);

      if (!product) {
        return res.status(404).json({
          success: false,
          error: "Product not found"
        });
      }

      // Delete product
      await product.delete();

      return res.json({
        success: true,
        message: "Product deleted successfully",
        id: product_id
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
};

```

### Soft Delete Function

```jsx
module.exports = {
  softDeleteProduct: async ({ req, res }) => {
    try {
      const { product_id } = params;
      const Product = req.getModel("Product");

      // Find product
      const product = await Product.find(product_id);

      if (!product) {
        return res.status(404).json({
          success: false,
          error: "Product not found"
        });
      }

      // Soft delete by marking as unavailable and adding deleted flag
      product.available = false;
      product.deleted = true;
      product.deleted_at = new Date().getTime();

      // Save changes
      await product.save();

      return res.json({
        success: true,
        message: "Product soft deleted successfully",
        id: product_id
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
};

```

### Bulk Delete Function

```jsx
module.exports = {
  bulkDeleteProducts: async ({ req, res }) => {
    try {
      // Validate input
      if (!req.body.product_ids || !Array.isArray(req.body.product_ids)) {
        return res.status(400).json({
          success: false,
          error: "Product IDs array is required"
        });
      }

      const Product = req.getModel("Product");
      const results = {
        success: [],
        failed: []
      };

      // Process each product deletion
      for (const productId of req.body.product_ids) {
        try {
          // Find product
          const product = await Product.find(productId);

          if (!product) {
            results.failed.push({
              id: productId,
              error: "Product not found"
            });
            continue;
          }

          // Delete product
          await product.delete();

          results.success.push({
            id: productId
          });
        } catch (error) {
          results.failed.push({
            id: productId,
            error: error.message
          });
        }
      }

      return res.json({
        success: true,
        message: `Deleted ${results.success.length} products, failed ${results.failed.length} products`,
        results: results
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
};

```

---

## Search and Filtering

Implementing robust search and filtering functionality is crucial for many applications:

### Basic Search Function

```jsx
module.exports = {
  searchProducts: async ({ req, res }) => {
    try {
      const Product = req.getModel("Product");

      // Get search parameters
      const keyword = req.query.keyword || "";
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const skip = (page - 1) * limit;

      // Build query
      let query = Product.filter({ available: true });

      if (keyword) {
        query = query.filter({
          $text: {
            $search: keyword,
            $caseSensitive: false
          }
        });
      }

      // Execute query with pagination
      const products = await query
        .orderBy("created_at", "desc")
        .skip(skip)
        .limit(limit)
        .run();

      // Get total count for pagination
      const totalCount = await Product.query().count({
        available: true,
        $text: keyword ? {
          $search: keyword,
          $caseSensitive: false
        } : undefined
      }).run();

      // Transform to JSON
      const transformedProducts = await products.transform(true);

      return res.json({
        success: true,
        keyword: keyword,
        products: transformedProducts,
        pagination: {
          total: totalCount,
          page: page,
          limit: limit,
          pages: Math.ceil(totalCount / limit)
        }
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
};

```

### Advanced Search with Multiple Filters

```jsx
module.exports = {
  advancedProductSearch: async ({ req, res }) => {
    try {
      const Product = req.getModel("Product");

      // Get search parameters
      const keyword = req.query.keyword || "";
      const minPrice = parseFloat(req.query.min_price) || 0;
      const maxPrice = parseFloat(req.query.max_price) || Number.MAX_SAFE_INTEGER;
      const collections = req.query.collections ? req.query.collections.split(',') : [];
      const tags = req.query.tags ? req.query.tags.split(',') : [];
      const sortBy = req.query.sort_by || "created_at";
      const sortOrder = req.query.sort_order || "desc";
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const skip = (page - 1) * limit;

      // Build query
      let queryFilters = {
        available: true,
        _price: {
          $gte: minPrice,
          $lte: maxPrice
        }
      };

      // Add text search if keyword provided
      if (keyword) {
        queryFilters.$text = {
          $search: keyword,
          $caseSensitive: false
        };
      }

      // Add collections filter if provided
      if (collections.length > 0) {
        queryFilters.collectionsKeys = {
          $elemMatch: {
            $in: collections
          }
        };
      }

      // Add tags filter if provided
      if (tags.length > 0) {
        queryFilters.tags = {
          $elemMatch: {
            $in: tags
          }
        };
      }

      // Execute query with pagination
      const products = await Product.filter(queryFilters)
        .orderBy(sortBy === "price" ? "_price" : sortBy, sortOrder)
        .skip(skip)
        .limit(limit)
        .run();

      // Get total count for pagination
      const totalCount = await Product.query().count(queryFilters).run();

      // Transform to JSON
      const transformedProducts = await products.transform(true);

      // Get available collections and tags for faceted search
      const facets = await getFacetsForSearch(Product, queryFilters);

      return res.json({
        success: true,
        filters: {
          keyword: keyword,
          min_price: minPrice,
          max_price: maxPrice,
          collections: collections,
          tags: tags,
          sort_by: sortBy,
          sort_order: sortOrder
        },
        products: transformedProducts,
        facets: facets,
        pagination: {
          total: totalCount,
          page: page,
          limit: limit,
          pages: Math.ceil(totalCount / limit)
        }
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
};

// Helper function to get facets for search results
async function getFacetsForSearch(Product, baseFilters) {
  // Clone the base filters but remove the collections and tags filters
  // to get all possible values for faceted navigation
  const facetFilters = { ...baseFilters };
  delete facetFilters.collectionsKeys;
  delete facetFilters.tags;

  // Get all products matching the other filters
  const facetProducts = await Product.filter(facetFilters).pluck("collectionsKeys", "tags").run();

  // Process collections
  const collections = {};

  // Process tags
  const tags = {};

  for (const product of facetProducts) {
    // Count collections
    if (product.collectionsKeys) {
      for (const collection of product.collectionsKeys) {
        collections[collection] = (collections[collection] || 0) + 1;
      }
    }

    // Count tags
    if (product.tags) {
      for (const tag of product.tags) {
        tags[tag] = (tags[tag] || 0) + 1;
      }
    }
  }

  return {
    collections: Object.entries(collections).map(([key, count]) => ({ key, count })),
    tags: Object.entries(tags).map(([key, count]) => ({ key, count }))
  };
}

```

### Search with Aggregations

```jsx
module.exports = {
  productSearchWithAggregations: async ({ req, res }) => {
    try {
      const Product = req.getModel("Product");

      // Get search parameters
      const keyword = req.query.keyword || "";
      const category = req.query.category;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const skip = (page - 1) * limit;

      // Build query
      let queryFilters = { available: true };

      if (keyword) {
        queryFilters.$text = {
          $search: keyword,
          $caseSensitive: false
        };
      }

      if (category) {
        queryFilters.collectionsKeys = {
          $elemMatch: {
            $eq: category
          }
        };
      }

      // Execute query with pagination
      const products = await Product.filter(queryFilters)
        .orderBy("created_at", "desc")
        .skip(skip)
        .limit(limit)
        .run();

      // Get total count for pagination
      const totalCount = await Product.query().count(queryFilters).run();

      // Transform to JSON
      const transformedProducts = await products.transform(true);

      // Get price aggregations
      const priceStats = await getPriceAggregations(Product, queryFilters);

      // Get top collections
      const topCollections = await getTopCollections(Product, queryFilters, 10);

      return res.json({
        success: true,
        keyword: keyword,
        category: category,
        products: transformedProducts,
        aggregations: {
          price: priceStats,
          top_collections: topCollections
        },
        pagination: {
          total: totalCount,
          page: page,
          limit: limit,
          pages: Math.ceil(totalCount / limit)
        }
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
};

// Helper function to get price aggregations
async function getPriceAggregations(Product, baseFilters) {
  const products = await Product.filter(baseFilters).pluck("_price").run();

  if (products.length === 0) {
    return {
      min: 0,
      max: 0,
      avg: 0,
      count: 0
    };
  }

  const prices = products.map(p => p._price).filter(p => p !== undefined && p !== null);

  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
    avg: prices.reduce((sum, price) => sum + price, 0) / prices.length,
    count: prices.length
  };
}

// Helper function to get top collections
async function getTopCollections(Product, baseFilters, limit) {
  const products = await Product.filter(baseFilters).pluck("collectionsKeys").run();

  const collectionsCount = {};

  for (const product of products) {
    if (product.collectionsKeys) {
      for (const collection of product.collectionsKeys) {
        collectionsCount[collection] = (collectionsCount[collection] || 0) + 1;
      }
    }
  }

  return Object.entries(collectionsCount)
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

```

---

## Collection Management

Managing collections of items is a common requirement in e-commerce and content management systems:

### Create Collection

```jsx
module.exports = {
  createCollection: async ({ req, res }) => {
    try {
      const Collection = req.getModel("Collection");

      // Validate required fields
      if (!req.body.name || !req.body.key) {
        return res.status(400).json({
          success: false,
          error: "Name and key are required"
        });
      }

      // Check if collection with this key already exists
      const existingCollection = await Collection.filter({ key: req.body.key }).first();

      if (existingCollection) {
        return res.status(409).json({
          success: false,
          error: "Collection with this key already exists"
        });
      }

      // Create collection
      const collection = Collection.new({
        name: req.body.name,
        key: req.body.key,
        description: req.body.description || "",
        parentKey: req.body.parentKey || null,
        display: req.body.display !== false,
        order: req.body.order || 0,
        created_at: new Date().getTime(),
        updated_at: new Date().getTime()
      });

      await collection.save();

      // Transform to JSON
      const transformedCollection = await collection.transform(true);

      return res.json({
        success: true,
        message: "Collection created successfully",
        collection: transformedCollection
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
};

```

### Get Collection with Products

```jsx
module.exports = {
  getCollectionWithProducts: async ({ req, res }) => {
    try {
      const { collection_key } = params;
      const Collection = req.getModel("Collection");
      const Product = req.getModel("Product");

      // Find collection
      const collection = await Collection.filter({ key: collection_key }).first();

      if (!collection) {
        return res.status(404).json({
          success: false,
          error: "Collection not found"
        });
      }

      // Get child collections
      const childCollections = await Collection.filter({ parentKey: collection_key }).run();

      // Get collection keys including children
      const collectionKeys = [collection_key];
      const childCollectionKeys = await collection.getChildsKeys();
      collectionKeys.push(...childCollectionKeys);

      // Get products in this collection and its children
      const products = await Product.filter({
        available: true,
        collectionsKeys: {
          $elemMatch: {
            $in: collectionKeys
          }
        }
      })
      .orderBy("created_at", "desc")
      .limit(20)
      .run();

      // Transform to JSON
      const transformedCollection = await collection.transform(true);
      const transformedChildCollections = await childCollections.transform(true);
      const transformedProducts = await products.transform(true);

      return res.json({
        success: true,
        collection: transformedCollection,
        child_collections: transformedChildCollections,
        products: transformedProducts
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
};

```

### Update Collection Hierarchy

```jsx
module.exports = {
  updateCollectionHierarchy: async ({ req, res }) => {
    try {
      // Validate input
      if (!req.body.collections || !Array.isArray(req.body.collections)) {
        return res.status(400).json({
          success: false,
          error: "Collections array is required"
        });
      }

      const Collection = req.getModel("Collection");
      const results = {
        success: [],
        failed: []
      };

      // Process each collection update
      for (const collectionUpdate of req.body.collections) {
        try {
          if (!collectionUpdate.key) {
            results.failed.push({
              data: collectionUpdate,
              error: "Collection key is required"
            });
            continue;
          }

          // Find collection
          const collection = await Collection.filter({ key: collectionUpdate.key }).first();

          if (!collection) {
            results.failed.push({
              key: collectionUpdate.key,
              error: "Collection not found"
            });
            continue;
          }

          // Update parent and order
          if (collectionUpdate.parentKey !== undefined) {
            // Verify parent exists if not null
            if (collectionUpdate.parentKey) {
              const parentExists = await Collection.filter({ key: collectionUpdate.parentKey }).first();
              if (!parentExists) {
                results.failed.push({
                  key: collectionUpdate.key,
                  error: "Parent collection not found"
                });
                continue;
              }

              // Check for circular reference
              if (await wouldCreateCircularReference(Collection, collectionUpdate.key, collectionUpdate.parentKey)) {
                results.failed.push({
                  key: collectionUpdate.key,
                  error: "Would create circular reference"
                });
                continue;
              }
            }

            collection.parentKey = collectionUpdate.parentKey;
          }

          if (collectionUpdate.order !== undefined) {
            collection.order = collectionUpdate.order;
          }

          if (collectionUpdate.display !== undefined) {
            collection.display = collectionUpdate.display;
          }

          // Update timestamp
          collection.updated_at = new Date().getTime();

          // Save changes
          await collection.save();

          // Transform to JSON
          const transformedCollection = await collection.transform(true);

          results.success.push({
            key: collectionUpdate.key,
            collection: transformedCollection
          });
        } catch (error) {
          results.failed.push({
            key: collectionUpdate.key,
            error: error.message
          });
        }
      }

      return res.json({
        success: true,
        message: `Updated ${results.success.length} collections, failed ${results.failed.length} collections`,
        results: results
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
};

// Helper function to check if setting a parent would create a circular reference
async function wouldCreateCircularReference(Collection, childKey, parentKey) {
  // If we're trying to set a collection as its own parent
  if (childKey === parentKey) {
    return true;
  }

  // Check if any ancestor of the potential parent is the child
  let currentKey = parentKey;
  const visited = new Set();

  while (currentKey) {
    // Avoid infinite loops if there's already a circular reference
    if (visited.has(currentKey)) {
      return true;
    }

    visited.add(currentKey);

    // If we find the child in the ancestry chain, it would create a circular reference
    if (currentKey === childKey) {
      return true;
    }

    // Get the parent of the current collection
    const current = await Collection.filter({ key: currentKey }).first();

    if (!current || !current.parentKey) {
      break;
    }

    currentKey = current.parentKey;
  }

  return false;
}

```

---

## Product Management

Product management often involves complex operations with multiple related entities:

### Add Product to Collection

```jsx
module.exports = {
  addProductToCollection: async ({ req, res }) => {
    try {
      const { product_id, collection_key } = params;
      const Product = req.getModel("Product");
      const Collection = req.getModel("Collection");

      // Find product
      const product = await Product.find(product_id);

      if (!product) {
        return res.status(404).json({
          success: false,
          error: "Product not found"
        });
      }

      // Find collection
      const collection = await Collection.filter({ key: collection_key }).first();

      if (!collection) {
        return res.status(404).json({
          success: false,
          error: "Collection not found"
        });
      }

      // Add collection key to product if not already present
      if (!product.collectionsKeys) {
        product.collectionsKeys = [];
      }

      if (!product.collectionsKeys.includes(collection_key)) {
        product.collectionsKeys.push(collection_key);
        product.updated_at = new Date().getTime();
        await product.save();
      }

      // Transform to JSON
      const transformedProduct = await product.transform(true);

      return res.json({
        success: true,
        message: "Product added to collection successfully",
        product: transformedProduct
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
};

```

### Remove Product from Collection

```jsx
module.exports = {
  removeProductFromCollection: async ({ req, res }) => {
    try {
      const { product_id, collection_key } = params;
      const Product = req.getModel("Product");

      // Find product
      const product = await Product.find(product_id);

      if (!product) {
        return res.status(404).json({
          success: false,
          error: "Product not found"
        });
      }

      // Remove collection key from product if present
      if (product.collectionsKeys && product.collectionsKeys.includes(collection_key)) {
        product.collectionsKeys = product.collectionsKeys.filter(key => key !== collection_key);
        product.updated_at = new Date().getTime();
        await product.save();
      }

      // Transform to JSON
      const transformedProduct = await product.transform(true);

      return res.json({
        success: true,
        message: "Product removed from collection successfully",
        product: transformedProduct
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
};

```

### Bulk Add Products to Collection

```jsx
module.exports = {
  bulkAddProductsToCollection: async ({ req, res }) => {
    try {
      // Validate input
      if (!req.body.product_ids || !Array.isArray(req.body.product_ids)) {
        return res.status(400).json({
          success: false,
          error: "Product IDs array is required"
        });
      }

      if (!req.body.collection_key) {
        return res.status(400).json({
          success: false,
          error: "Collection key is required"
        });
      }

      const Product = req.getModel("Product");
      const Collection = req.getModel("Collection");
      const collection_key = req.body.collection_key;

      // Find collection
      const collection = await Collection.filter({ key: collection_key }).first();

      if (!collection) {
        return res.status(404).json({
          success: false,
          error: "Collection not found"
        });
      }

      const results = {
        success: [],
        failed: []
      };

      // Process each product
      for (const productId of req.body.product_ids) {
        try {
          // Find product
          const product = await Product.find(productId);

          if (!product) {
            results.failed.push({
              id: productId,
              error: "Product not found"
            });
            continue;
          }

          // Add collection key to product if not already present
          if (!product.collectionsKeys) {
            product.collectionsKeys = [];
          }

          if (!product.collectionsKeys.includes(collection_key)) {
            product.collectionsKeys.push(collection_key);
            product.updated_at = new Date().getTime();
            await product.save();
          }

          results.success.push({
            id: productId
          });
        } catch (error) {
          results.failed.push({
            id: productId,
            error: error.message
          });
        }
      }

      return res.json({
        success: true,
        message: `Added ${results.success.length} products to collection, failed ${results.failed.length} products`,
        results: results
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
};

```

### Update Product Inventory

```jsx
module.exports = {
  updateProductInventory: async ({ req, res }) => {
    try {
      const { product_id } = params;
      const Product = req.getModel("Product");
      const Inventory = req.getModel("Inventory");

      // Validate input
      if (req.body.quantity === undefined) {
        return res.status(400).json({
          success: false,
          error: "Quantity is required"
        });
      }

      // Find product
      const product = await Product.find(product_id);

      if (!product) {
        return res.status(404).json({
          success: false,
          error: "Product not found"
        });
      }

      // Find or create inventory record
      let inventory = await Inventory.filter({ productId: product_id }).first();

      if (!inventory) {
        inventory = Inventory.new({
          productId: product_id,
          quantity: 0,
          created_at: new Date().getTime()
        });
      }

      // Update inventory
      const oldQuantity = inventory.quantity || 0;
      const newQuantity = parseInt(req.body.quantity);
      inventory.quantity = newQuantity;
      inventory.updated_at = new Date().getTime();

      // Save inventory
      await inventory.save();

      // Update product availability based on inventory
      const wasAvailable = product.available;
      product.available = newQuantity > 0;

      if (wasAvailable !== product.available) {
        product.updated_at = new Date().getTime();
        await product.save();
      }

      // Create inventory log
      const InventoryLog = req.getModel("InventoryLog");
      const log = InventoryLog.new({
        productId: product_id,
        oldQuantity: oldQuantity,
        newQuantity: newQuantity,
        change: newQuantity - oldQuantity,
        reason: req.body.reason || "Manual update",
        userId: req.user ? req.user.id : null,
        timestamp: new Date().getTime()
      });

      await log.save();

      return res.json({
        success: true,
        message: "Product inventory updated successfully",
        inventory: {
          productId: product_id,
          quantity: newQuantity,
          available: product.available,
          change: newQuantity - oldQuantity
        }
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
};

```

---

## Advanced Patterns

### Implementing a Product Recommendation Engine

```jsx
module.exports = {
  getProductRecommendations: async ({ req, res }) => {
    try {
      const { product_id } = params;
      const Product = req.getModel("Product");

      // Find the source product
      const product = await Product.find(product_id);

      if (!product) {
        return res.status(404).json({
          success: false,
          error: "Product not found"
        });
      }

      // Transform to JSON for use in recommendations
      const sourceProduct = await product.transform(true);

      // Get recommendations based on different strategies
      const recommendations = {
        // Products from the same collections
        similar: await getSimilarProducts(Product, sourceProduct),

        // Products frequently bought together
        frequently_bought_together: await getFrequentlyBoughtTogether(Product, product_id),

        // Products in the same price range
        price_range: await getProductsInPriceRange(Product, sourceProduct),

        // Recently viewed products (if user is logged in)
        recently_viewed: req.user ? await getRecentlyViewedProducts(req, Product) : []
      };

      return res.json({
        success: true,
        source_product: sourceProduct,
        recommendations: recommendations
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
};

// Helper function to get similar products based on collections
async function getSimilarProducts(Product, sourceProduct, limit = 6) {
  if (!sourceProduct.collectionsKeys || sourceProduct.collectionsKeys.length === 0) {
    return [];
  }

  // Find products in the same collections
  const products = await Product.filter({
    available: true,
    id: { $ne: sourceProduct.id },
    collectionsKeys: {
      $elemMatch: {
        $in: sourceProduct.collectionsKeys
      }
    }
  })
  .orderBy("created_at", "desc")
  .limit(limit)
  .run();

  return products.transform(true);
}

// Helper function to get frequently bought together products
async function getFrequentlyBoughtTogether(Product, productId, limit = 4) {
  const Order = req.getModel("Order");

  // Find orders containing this product
  const orders = await Order.filter({
    "items.productId": productId,
    status: "completed"
  })
  .pluck("items")
  .limit(100)
  .run();

  // Count product occurrences
  const productCounts = {};

  for (const order of orders) {
    const orderProductIds = order.items.map(item => item.productId);

    for (const id of orderProductIds) {
      if (id !== productId) {
        productCounts[id] = (productCounts[id] || 0) + 1;
      }
    }
  }

  // Sort by frequency and get top products
  const topProductIds = Object.entries(productCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(entry => entry[0]);

  if (topProductIds.length === 0) {
    return [];
  }

  // Get product details
  const products = await Product.filter({
    available: true,
    id: { $in: topProductIds }
  }).run();

  // Sort by the original frequency order
  const transformedProducts = await products.transform(true);
  return transformedProducts.sort((a, b) => {
    return productCounts[b.id] - productCounts[a.id];
  });
}

// Helper function to get products in similar price range
async function getProductsInPriceRange(Product, sourceProduct, limit = 6) {
  if (!sourceProduct._price) {
    return [];
  }

  const price = sourceProduct._price;
  const minPrice = price * 0.8;
  const maxPrice = price * 1.2;

  // Find products in similar price range
  const products = await Product.filter({
    available: true,
    id: { $ne: sourceProduct.id },
    _price: {
      $gte: minPrice,
      $lte: maxPrice
    }
  })
  .orderBy("created_at", "desc")
  .limit(limit)
  .run();

  return products.transform(true);
}

// Helper function to get recently viewed products
async function getRecentlyViewedProducts(req, Product, limit = 6) {
  if (!req.user) {
    return [];
  }

  const ViewHistory = req.getModel("ViewHistory");

  // Get user's view history
  const viewHistory = await ViewHistory.filter({
    userId: req.user.id,
    type: "product"
  })
  .orderBy("timestamp", "desc")
  .limit(limit)
  .run();

  if (viewHistory.length === 0) {
    return [];
  }

  // Get product IDs from view history
  const productIds = viewHistory.map(view => view.itemId);

  // Get product details
  const products = await Product.filter({
    available: true,
    id: { $in: productIds }
  }).run();

  // Sort by the original view history order
  const transformedProducts = await products.transform(true);
  const productIdToIndex = {};

  productIds.forEach((id, index) => {
    productIdToIndex[id] = index;
  });

  return transformedProducts.sort((a, b) => {
    return productIdToIndex[a.id] - productIdToIndex[b.id];
  });
}

```

### Implementing a Content Management System

```jsx
module.exports = {
  // Create a new page
  createPage: async ({ req, res }) => {
    try {
      // Check authentication and authorization
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: "Unauthorized"
        });
      }

      if (!"root admin editor".includes(req.user.role.key)) {
        return res.status(403).json({
          success: false,
          error: "Forbidden"
        });
      }

      const Page = req.getModel("Page");

      // Validate required fields
      if (!req.body.title || !req.body.slug) {
        return res.status(400).json({
          success: false,
          error: "Title and slug are required"
        });
      }

      // Check if slug is already in use
      const existingPage = await Page.filter({ slug: req.body.slug }).first();

      if (existingPage) {
        return res.status(409).json({
          success: false,
          error: "Page with this slug already exists"
        });
      }

      // Create page
      const page = Page.new({
        title: req.body.title,
        slug: req.body.slug,
        content: req.body.content || "",
        metaTitle: req.body.metaTitle || req.body.title,
        metaDescription: req.body.metaDescription || "",
        published: req.body.published === true,
        authorId: req.user.id,
        created_at: new Date().getTime(),
        updated_at: new Date().getTime()
      });

      await page.save();

      // Transform to JSON
      const transformedPage = await page.transform(true);

      return res.json({
        success: true,
        message: "Page created successfully",
        page: transformedPage
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // Update an existing page
  updatePage: async ({ req, res }) => {
    try {
      // Check authentication and authorization
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: "Unauthorized"
        });
      }

      if (!"root admin editor".includes(req.user.role.key)) {
        return res.status(403).json({
          success: false,
          error: "Forbidden"
        });
      }

      const { page_id } = params;
      const Page = req.getModel("Page");

      // Find page
      const page = await Page.find(page_id);

      if (!page) {
        return res.status(404).json({
          success: false,
          error: "Page not found"
        });
      }

      // Check if slug is already in use by another page
      if (req.body.slug && req.body.slug !== page.slug) {
        const existingPage = await Page.filter({ slug: req.body.slug }).first();

        if (existingPage && existingPage.id !== page_id) {
          return res.status(409).json({
            success: false,
            error: "Page with this slug already exists"
          });
        }

        page.slug = req.body.slug;
      }

      // Update fields
      if (req.body.title !== undefined) page.title = req.body.title;
      if (req.body.content !== undefined) page.content = req.body.content;
      if (req.body.metaTitle !== undefined) page.metaTitle = req.body.metaTitle;
      if (req.body.metaDescription !== undefined) page.metaDescription = req.body.metaDescription;
      if (req.body.published !== undefined) page.published = req.body.published;

      // Update timestamp
      page.updated_at = new Date().getTime();

      // Save changes
      await page.save();

      // Transform to JSON
      const transformedPage = await page.transform(true);

      return res.json({
        success: true,
        message: "Page updated successfully",
        page: transformedPage
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // Get page by slug
  getPageBySlug: async ({ req, res }) => {
    try {
      const { slug } = params;
      const Page = req.getModel("Page");

      // Find page
      const page = await Page.filter({ slug: slug }).first();

      if (!page) {
        return res.status(404).json({
          success: false,
          error: "Page not found"
        });
      }

      // Check if page is published
      if (!page.published && (!req.user || !"root admin editor".includes(req.user.role.key))) {
        return res.status(404).json({
          success: false,
          error: "Page not found"
        });
      }

      // Transform to JSON
      const transformedPage = await page.transform(true);

      return res.json({
        success: true,
        page: transformedPage
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // List pages with pagination and filtering
  listPages: async ({ req, res }) => {
    try {
      const Page = req.getModel("Page");

      // Check if user can see unpublished pages
      const canSeeUnpublished = req.user && "root admin editor".includes(req.user.role.key);

      // Pagination parameters
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const skip = (page - 1) * limit;

      // Filtering parameters
      const filters = {};

      if (!canSeeUnpublished) {
        filters.published = true;
      } else if (req.query.published !== undefined) {
        filters.published = req.query.published === 'true';
      }

      if (req.query.authorId) {
        filters.authorId = req.query.authorId;
      }

      // Sorting parameters
      const sortField = req.query.sort_field || "updated_at";
      const sortOrder = req.query.sort_order || "desc";

      // Execute query
      const pages = await Page.filter(filters)
        .orderBy(sortField, sortOrder)
        .skip(skip)
        .limit(limit)
        .run();

      // Get total count for pagination
      const totalCount = await Page.query().count(filters).run();

      // Transform to JSON
      const transformedPages = await pages.transform(true);

      return res.json({
        success: true,
        pages: transformedPages,
        pagination: {
          total: totalCount,
          page: page,
          limit: limit,
          pages: Math.ceil(totalCount / limit)
        }
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
};

```

---

## Complete Examples

### E-commerce Product Controller

```jsx
module.exports = {
  // Create a new product
  createProduct: async ({ req, res }) => {
    try {
      // Check authentication and authorization
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: "Unauthorized"
        });
      }

      if (!"root admin".includes(req.user.role.key)) {
        return res.status(403).json({
          success: false,
          error: "Forbidden"
        });
      }

      const Product = req.getModel("Product");
      const Inventory = req.getModel("Inventory");

      // Validate required fields
      if (!req.body.title || req.body.price === undefined) {
        return res.status(400).json({
          success: false,
          error: "Title and price are required"
        });
      }

      // Create product
      const product = Product.new({
        title: req.body.title,
        description: req.body.description || "",
        price: parseFloat(req.body.price),
        _price: parseFloat(req.body.price), // For sorting
        compareAtPrice: req.body.compareAtPrice ? parseFloat(req.body.compareAtPrice) : null,
        sku: req.body.sku || null,
        barcode: req.body.barcode || null,
        weight: req.body.weight ? parseFloat(req.body.weight) : null,
        collectionsKeys: req.body.collectionsKeys || [],
        tags: req.body.tags || [],
        available: req.body.available !== false,
        featuredImageId: req.body.featuredImageId || null,
        imageIds: req.body.imageIds || [],
        variants: req.body.variants || [],
        options: req.body.options || [],
        metaTitle: req.body.metaTitle || req.body.title,
        metaDescription: req.body.metaDescription || "",
        createdBy: req.user.id,
        created_at: new Date().getTime(),
        updated_at: new Date().getTime()
      });

      await product.save();

      // Create inventory record if quantity is provided
      if (req.body.quantity !== undefined) {
        const inventory = Inventory.new({
          productId: product.id,
          quantity: parseInt(req.body.quantity),
          created_at: new Date().getTime(),
          updated_at: new Date().getTime()
        });

        await inventory.save();
      }

      // Transform to JSON
      const transformedProduct = await product.transform(true);

      return res.json({
        success: true,
        message: "Product created successfully",
        product: transformedProduct
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // Get product by ID
  getProduct: async ({ req, res }) => {
    try {
      const { product_id } = params;
      const Product = req.getModel("Product");
      const Inventory = req.getModel("Inventory");

      // Find product
      const product = await Product.find(product_id);

      if (!product) {
        return res.status(404).json({
          success: false,
          error: "Product not found"
        });
      }

      // Check if product is available for non-admin users
      if (!product.available && (!req.user || !"root admin".includes(req.user.role.key))) {
        return res.status(404).json({
          success: false,
          error: "Product not found"
        });
      }

      // Get inventory
      const inventory = await Inventory.filter({ productId: product_id }).first();

      // Transform to JSON
      const transformedProduct = await product.transform(true);

      // Add inventory data
      transformedProduct.inventory = inventory ? {
        quantity: inventory.quantity,
        inStock: inventory.quantity > 0
      } : null;

      // If user is logged in, check if product is in favorites
      if (req.user) {
        transformedProduct.isFavorite = req.user.favoritesIds && req.user.favoritesIds.includes(product_id);
      }

      // Get related products
      const relatedProducts = await getRelatedProducts(Product, transformedProduct, 4);

      return res.json({
        success: true,
        product: transformedProduct,
        related_products: relatedProducts
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // Update product
  updateProduct: async ({ req, res }) => {
    try {
      // Check authentication and authorization
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: "Unauthorized"
        });
      }

      if (!"root admin".includes(req.user.role.key)) {
        return res.status(403).json({
          success: false,
          error: "Forbidden"
        });
      }

      const { product_id } = params;
      const Product = req.getModel("Product");

      // Find product
      const product = await Product.find(product_id);

      if (!product) {
        return res.status(404).json({
          success: false,
          error: "Product not found"
        });
      }

      // Update fields
      const fields = [
        'title', 'description', 'price', 'compareAtPrice', 'sku', 'barcode',
        'weight', 'collectionsKeys', 'tags', 'available', 'featuredImageId',
        'imageIds', 'variants', 'options', 'metaTitle', 'metaDescription'
      ];

      let updated = false;

      for (const field of fields) {
        if (req.body[field] !== undefined) {
          if (field === 'price') {
            product[field] = parseFloat(req.body[field]);
            product._price = parseFloat(req.body[field]); // For sorting
          } else if (field === 'compareAtPrice' || field === 'weight') {
            product[field] = req.body[field] ? parseFloat(req.body[field]) : null;
          } else {
            product[field] = req.body[field];
          }
          updated = true;
        }
      }

      if (updated) {
        // Update timestamp
        product.updated_at = new Date().getTime();

        // Save changes
        await product.save();
      }

      // Update inventory if quantity is provided
      if (req.body.quantity !== undefined) {
        const Inventory = req.getModel("Inventory");
        let inventory = await Inventory.filter({ productId: product_id }).first();

        if (!inventory) {
          inventory = Inventory.new({
            productId: product_id,
            quantity: parseInt(req.body.quantity),
            created_at: new Date().getTime()
          });
        } else {
          inventory.quantity = parseInt(req.body.quantity);
          inventory.updated_at = new Date().getTime();
        }

        await inventory.save();
      }

      // Transform to JSON
      const transformedProduct = await product.transform(true);

      return res.json({
        success: true,
        message: "Product updated successfully",
        product: transformedProduct
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // Delete product
  deleteProduct: async ({ req, res }) => {
    try {
      // Check authentication and authorization
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: "Unauthorized"
        });
      }

      if (!"root admin".includes(req.user.role.key)) {
        return res.status(403).json({
          success: false,
          error: "Forbidden"
        });
      }

      const { product_id } = params;
      const Product = req.getModel("Product");

      // Find product
      const product = await Product.find(product_id);

      if (!product) {
        return res.status(404).json({
          success: false,
          error: "Product not found"
        });
      }

      // Check if product can be safely deleted
      const Order = req.getModel("Order");
      const hasOrders = await Order.filter({ "items.productId": product_id }).first();

      if (hasOrders) {
        // Soft delete instead of hard delete
        product.available = false;
        product.deleted = true;
        product.deleted_at = new Date().getTime();
        await product.save();

        return res.json({
          success: true,
          message: "Product has been soft-deleted because it has associated orders",
          id: product_id
        });
      } else {
        // Hard delete
        await product.delete();

        // Delete associated inventory
        const Inventory = req.getModel("Inventory");
        const inventory = await Inventory.filter({ productId: product_id }).first();

        if (inventory) {
          await inventory.delete();
        }

        return res.json({
          success: true,
          message: "Product deleted successfully",
          id: product_id
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // Search products
  searchProducts: async ({ req, res }) => {
    try {
      const Product = req.getModel("Product");

      // Get search parameters
      const keyword = req.query.keyword || "";
      const minPrice = parseFloat(req.query.min_price) || 0;
      const maxPrice = parseFloat(req.query.max_price) || Number.MAX_SAFE_INTEGER;
      const collections = req.query.collections ? req.query.collections.split(',') : [];
      const tags = req.query.tags ? req.query.tags.split(',') : [];
      const sortBy = req.query.sort_by || "created_at";
      const sortOrder = req.query.sort_order || "desc";
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const skip = (page - 1) * limit;

      // Check if user can see unavailable products
      const canSeeUnavailable = req.user && "root admin".includes(req.user.role.key);

      // Build query
      let queryFilters = {
        _price: {
          $gte: minPrice,
          $lte: maxPrice
        }
      };

      if (!canSeeUnavailable) {
        queryFilters.available = true;
      }

      // Add text search if keyword provided
      if (keyword) {
        queryFilters.$text = {
          $search: keyword,
          $caseSensitive: false
        };
      }

      // Add collections filter if provided
      if (collections.length > 0) {
        queryFilters.collectionsKeys = {
          $elemMatch: {
            $in: collections
          }
        };
      }

      // Add tags filter if provided
      if (tags.length > 0) {
        queryFilters.tags = {
          $elemMatch: {
            $in: tags
          }
        };
      }

      // Execute query with pagination
      const products = await Product.filter(queryFilters)
        .orderBy(sortBy === "price" ? "_price" : sortBy, sortOrder)
        .skip(skip)
        .limit(limit)
        .run();

      // Get total count for pagination
      const totalCount = await Product.query().count(queryFilters).run();

      // Transform to JSON
      const transformedProducts = await products.transform(true);

      // Add favorites info if user is logged in
      if (req.user && req.user.favoritesIds) {
        for (const product of transformedProducts) {
          product.isFavorite = req.user.favoritesIds.includes(product.id);
        }
      }

      // Get facets for filtering
      const facets = await getProductFacets(Product, queryFilters);

      return res.json({
        success: true,
        filters: {
          keyword: keyword,
          min_price: minPrice,
          max_price: maxPrice,
          collections: collections,
          tags: tags,
          sort_by: sortBy,
          sort_order: sortOrder
        },
        products: transformedProducts,
        facets: facets,
        pagination: {
          total: totalCount,
          page: page,
          limit: limit,
          pages: Math.ceil(totalCount / limit)
        }
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // Toggle product favorite status
  toggleProductFavorite: async ({ req, res }) => {
    try {
      // Check authentication
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: "Unauthorized"
        });
      }

      const { product_id } = params;
      const User = req.getModel("User");
      const Product = req.getModel("Product");

      // Find product
      const product = await Product.find(product_id);

      if (!product) {
        return res.status(404).json({
          success: false,
          error: "Product not found"
        });
      }

      // Find user
      const user = await User.find(req.user.id);

      if (!user) {
        return res.status(404).json({
          success: false,
          error: "User not found"
        });
      }

      // Initialize favorites array if it doesn't exist
      if (!user.favoritesIds) {
        user.favoritesIds = [];
      }

      // Toggle favorite status
      const isFavorite = user.favoritesIds.includes(product_id);

      if (isFavorite) {
        // Remove from favorites
        user.favoritesIds = user.favoritesIds.filter(id => id !== product_id);
      } else {
        // Add to favorites
        user.favoritesIds.push(product_id);
      }

      // Save changes
      await user.save();

      return res.json({
        success: true,
        message: isFavorite ? "Product removed from favorites" : "Product added to favorites",
        isFavorite: !isFavorite
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
};

// Helper function to get related products
async function getRelatedProducts(Product, sourceProduct, limit = 4) {
  if (!sourceProduct.collectionsKeys || sourceProduct.collectionsKeys.length === 0) {
    return [];
  }

  // Find products in the same collections
  const products = await Product.filter({
    available: true,
    id: { $ne: sourceProduct.id },
    collectionsKeys: {
      $elemMatch: {
        $in: sourceProduct.collectionsKeys
      }
    }
  })
  .orderBy("created_at", "desc")
  .limit(limit)
  .run();

  return products.transform(true);
}

// Helper function to get facets for product search
async function getProductFacets(Product, baseFilters) {
  // Clone the base filters but remove the collections and tags filters
  const facetFilters = { ...baseFilters };
  delete facetFilters.collectionsKeys;
  delete facetFilters.tags;

  // Get all products matching the other filters
  const facetProducts = await Product.filter(facetFilters).pluck("collectionsKeys", "tags", "_price").run();

  // Process collections
  const collections = {};

  // Process tags
  const tags = {};

  // Process price ranges
  let minPrice = Number.MAX_SAFE_INTEGER;
  let maxPrice = 0;

  for (const product of facetProducts) {
    // Count collections
    if (product.collectionsKeys) {
      for (const collection of product.collectionsKeys) {
        collections[collection] = (collections[collection] || 0) + 1;
      }
    }

    // Count tags
    if (product.tags) {
      for (const tag of product.tags) {
        tags[tag] = (tags[tag] || 0) + 1;
      }
    }

    // Track price range
    if (product._price !== undefined) {
      minPrice = Math.min(minPrice, product._price);
      maxPrice = Math.max(maxPrice, product._price);
    }
  }

  // Create price ranges
  const priceRanges = [];
  if (facetProducts.length > 0 && minPrice <= maxPrice) {
    const range = maxPrice - minPrice;
    const step = range / 4; // Create 4 price ranges

    for (let i = 0; i < 4; i++) {
      const rangeMin = minPrice + (step * i);
      const rangeMax = i === 3 ? maxPrice : minPrice + (step * (i + 1));

      // Count products in this range
      const count = facetProducts.filter(p =>
        p._price >= rangeMin && p._price <= rangeMax
      ).length;

      priceRanges.push({
        min: rangeMin,
        max: rangeMax,
        count: count
      });
    }
  }

  return {
    collections: Object.entries(collections).map(([key, count]) => ({ key, count })),
    tags: Object.entries(tags).map(([key, count]) => ({ key, count })),
    price_ranges: priceRanges,
    price_stats: {
      min: minPrice === Number.MAX_SAFE_INTEGER ? 0 : minPrice,
      max: maxPrice
    }
  };
}

```

By studying these examples and patterns, you should now be able to create any type of controller function in the CyberOcean framework, from simple CRUD operations to complex search functionality and advanced data manipulation.