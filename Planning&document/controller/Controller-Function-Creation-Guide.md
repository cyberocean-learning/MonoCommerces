# CyberOcean Framework: Controller Function Creation Guide

This guide will help you create new controller functions in the CyberOcean framework. Instead of just documenting existing functions, we'll focus on the patterns and techniques to create your own custom functions.

## Table of Contents

1. [Basic Controller Function Structure]
2. [Working with Models]
3. [Request and Response Handling]
4. [Authentication and Authorization]
5. [Caching Strategies]
6. [Nested Calls]
7. [Advanced Patterns]
8. [Common Use Cases]

---

## Basic Controller Function Structure

### Function Template

Every controller function in CyberOcean follows this basic structure:

```jsx
module.exports = {
  yourFunctionName: async ({ req, res, params, utils }) => {
    try {
      // Your function logic here

      return res.json({
        success: true,
        data: yourData
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

### Example: Creating a Simple Function

```jsx
module.exports = {
  getHelloWorld: async ({ req, res }) => {
    return res.json({
      message: "Hello, World!",
      timestamp: new Date().toISOString()
    });
  }
};

```

---

## Working with Models

### Accessing Models

Models are accessed through the request object:

```jsx
const YourModel = req.getModel("YourModel");

```

### Example: Creating a Function to List Items

```jsx
module.exports = {
  listProducts: async ({ req, res }) => {
    try {
      const Product = req.getModel("Product");

      // Get all products
      const products = await Product.all();

      // Transform to JSON
      const transformedProducts = await products.transform(true);

      return res.json(transformedProducts);
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
};

```

### Example: Creating a Function to Get a Single Item

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

      return res.json(transformedProduct);
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
};

```

### Example: Creating a Function to Filter Items

```jsx
module.exports = {
  getProductsByCategory: async ({ req, res }) => {
    try {
      const { category_id } = params;
      const Product = req.getModel("Product");

      // Filter products by category
      const products = await Product.filter({ categoryId: category_id }).run();

      // Transform to JSON
      const transformedProducts = await products.transform(true);

      return res.json(transformedProducts);
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
};

```

### Example: Creating a Function to Create an Item

```jsx
module.exports = {
  createProduct: async ({ req, res }) => {
    try {
      const Product = req.getModel("Product");

      // Create new product
      const product = Product.new({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        categoryId: req.body.categoryId
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

---

## Request and Response Handling

### Accessing Request Parameters

```jsx
// URL parameters
const { parameter_name } = params;

// Query parameters
const queryParam = req.query.parameter_name;

// Body parameters
const bodyParam = req.body.parameter_name;

```

### Example: Function with Multiple Parameter Types

```jsx
module.exports = {
  searchProducts: async ({ req, res }) => {
    try {
      const { category_id } = params; // URL parameter
      const keyword = req.query.keyword || ""; // Query parameter
      const sortBy = req.query.sortBy || "name"; // Query parameter
      const sortOrder = req.query.sortOrder || "asc"; // Query parameter
      const page = parseInt(req.query.page) || 1; // Query parameter
      const limit = parseInt(req.query.limit) || 10; // Query parameter

      const Product = req.getModel("Product");

      // Build filter
      let filter = {};

      if (category_id) {
        filter.categoryId = category_id;
      }

      if (keyword) {
        filter.name = { $regex: keyword, $options: "i" };
      }

      // Execute query with pagination
      const products = await Product.filter(filter)
        .orderBy(sortBy, sortOrder)
        .skip((page - 1) * limit)
        .limit(limit)
        .run();

      // Get total count for pagination
      const totalCount = await Product.count(filter);

      // Transform to JSON
      const transformedProducts = await products.transform(true);

      return res.json({
        success: true,
        data: transformedProducts,
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

## Authentication and Authorization

### Checking User Authentication

```jsx
if (!req.user) {
  return res.status(401).json({
    success: false,
    error: "Unauthorized"
  });
}

```

### Checking User Role

```jsx
if (!"root admin".includes(req.user.role.key)) {
  return res.status(403).json({
    success: false,
    error: "Forbidden"
  });
}

```

### Example: Creating a Protected Admin Function

```jsx
module.exports = {
  adminDeleteProduct: async ({ req, res }) => {
    try {
      // Check authentication
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: "Unauthorized"
        });
      }

      // Check authorization
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

      // Delete product
      await product.delete();

      return res.json({
        success: true,
        message: "Product deleted successfully"
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

## Caching Strategies

### Setting Cache

```jsx
await req.setCache("cache-key", dataToCache);

// With expiration time (in seconds)
await req.setCache("cache-key", dataToCache, { ttl: 3600 });

// With group for easier invalidation
await req.setCache("cache-key", dataToCache, { group: "group-name" });

```

### Getting Cache

```jsx
const cachedData = await req.getCache("cache-key");

```

### Deleting Cache

```jsx
// Delete specific cache
await req.deleteCache("cache-key");

// Delete cache by group
await req.deleteCacheByGroup("group-name");

```

### Example: Creating a Function with Caching

```jsx
module.exports = {
  getCachedProductsByCategory: async ({ req, res }) => {
    try {
      const { category_id } = params;

      // Try to get from cache first
      const cacheKey = `products-by-category-${category_id}`;
      let products = await req.getCache(cacheKey);

      if (!products) {
        // If not in cache, get from database
        const Product = req.getModel("Product");
        const productsQuery = await Product.filter({ categoryId: category_id }).run();
        products = await productsQuery.transform(true);

        // Save to cache for 1 hour
        await req.setCache(cacheKey, products, {
          ttl: 3600,
          group: `products-category-${category_id}`
        });
      }

      return res.json({
        success: true,
        data: products,
        fromCache: !!products
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  invalidateProductCategoryCache: async ({ req, res }) => {
    try {
      const { category_id } = params;

      // Invalidate cache for this category
      await req.deleteCacheByGroup(`products-category-${category_id}`);

      return res.json({
        success: true,
        message: "Cache invalidated successfully"
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

## Nested Calls

### Creating a Function for Nested Calls

```jsx
module.exports = {
  internalFunction: async ({ req, res }) => {
    // Check if this is a nested call
    if (!nestedCall) {
      return res.status(400).json({
        success: false,
        error: "This function is only available as a nested call"
      });
    }

    // Access nested arguments
    const { param1, param2 } = nestedArgs;

    // Function logic
    const result = /* your logic here */;

    // Return result directly (not as response)
    return result;
  }
};

```

### Calling a Nested Function

```jsx
module.exports = {
  parentFunction: async ({ req, res }) => {
    try {
      const SomeController = await getController("SomeController");

      // Call the nested function
      const result = await SomeController.internalFunction({
        nestedCall: true,
        nestedArgs: {
          param1: "value1",
          param2: "value2"
        }
      });

      return res.json({
        success: true,
        data: result
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

### Example: Creating Helper and Public Functions

```jsx
module.exports = {
  // Internal helper function
  calculateTotalPrice: async ({ req, res }) => {
    if (!nestedCall) {
      return "This function is only available as a nested call";
    }

    const { items, discountCode } = nestedArgs;
    let total = 0;

    // Calculate total price
    for (const item of items) {
      total += item.price * item.quantity;
    }

    // Apply discount if provided
    if (discountCode) {
      const Discount = req.getModel("Discount");
      const discount = await Discount.filter({ code: discountCode }).first();

      if (discount) {
        total = total * (1 - discount.percentage / 100);
      }
    }

    return total;
  },

  // Public function that uses the helper
  createOrder: async ({ req, res }) => {
    try {
      const Order = req.getModel("Order");
      const OrdersController = await getController("OrdersController");

      // Calculate total price using the helper function
      const totalPrice = await OrdersController.calculateTotalPrice({
        nestedCall: true,
        nestedArgs: {
          items: req.body.items,
          discountCode: req.body.discountCode
        }
      });

      // Create order
      const order = Order.new({
        userId: req.user.id,
        items: req.body.items,
        totalPrice: totalPrice,
        status: "pending"
      });

      await order.save();

      return res.json({
        success: true,
        message: "Order created successfully",
        order: await order.transform(true)
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

### Working with Transactions

```jsx
module.exports = {
  transferFunds: async ({ req, res }) => {
    try {
      const { fromAccountId, toAccountId, amount } = req.body;
      const Account = req.getModel("Account");
      const Transaction = req.getModel("Transaction");

      // Start transaction
      const session = await req.startTransaction();

      try {
        // Get accounts
        const fromAccount = await Account.find(fromAccountId);
        const toAccount = await Account.find(toAccountId);

        if (!fromAccount || !toAccount) {
          throw new Error("Account not found");
        }

        // Check balance
        if (fromAccount.balance < amount) {
          throw new Error("Insufficient funds");
        }

        // Update balances
        fromAccount.balance -= amount;
        toAccount.balance += amount;

        // Save accounts
        await fromAccount.save({ session });
        await toAccount.save({ session });

        // Create transaction record
        const transaction = Transaction.new({
          fromAccountId,
          toAccountId,
          amount,
          timestamp: new Date()
        });

        await transaction.save({ session });

        // Commit transaction
        await session.commitTransaction();

        return res.json({
          success: true,
          message: "Funds transferred successfully",
          transaction: await transaction.transform(true)
        });
      } catch (error) {
        // Abort transaction on error
        await session.abortTransaction();
        throw error;
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
};

```

### Working with External APIs

```jsx
module.exports = {
  getWeatherForCity: async ({ req, res }) => {
    try {
      const { city } = params;
      const apiKey = process.env.WEATHER_API_KEY;

      // Call external API
      const response = await axios.get(`https://api.weather.com/data?city=${encodeURIComponent(city)}&apiKey=${apiKey}`);

      // Process and return data
      return res.json({
        success: true,
        data: {
          city: city,
          temperature: response.data.temperature,
          conditions: response.data.conditions,
          forecast: response.data.forecast
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

### Implementing Webhooks

```jsx
module.exports = {
  handlePaymentWebhook: async ({ req, res }) => {
    try {
      const { event, data } = req.body;
      const Order = req.getModel("Order");

      // Verify webhook signature
      const signature = req.headers['x-payment-signature'];
      const isValid = verifySignature(req.body, signature, process.env.WEBHOOK_SECRET);

      if (!isValid) {
        return res.status(401).json({
          success: false,
          error: "Invalid signature"
        });
      }

      // Handle different event types
      switch (event) {
        case 'payment.succeeded':
          // Update order status
          const order = await Order.find(data.orderId);
          if (order) {
            order.status = 'paid';
            order.paymentDetails = data;
            await order.save();
          }
          break;

        case 'payment.failed':
          // Handle failed payment
          const failedOrder = await Order.find(data.orderId);
          if (failedOrder) {
            failedOrder.status = 'payment_failed';
            failedOrder.paymentError = data.error;
            await failedOrder.save();
          }
          break;

        default:
          // Ignore unknown events
          break;
      }

      // Always return 200 to acknowledge receipt
      return res.json({
        success: true,
        message: "Webhook received"
      });
    } catch (error) {
      // Log error but still return 200 to prevent retries
      console.error("Webhook error:", error);
      return res.json({
        success: false,
        error: error.message
      });
    }
  }
};

```

---

## Common Use Cases

### File Upload Handling

```jsx
module.exports = {
  uploadProductImage: async ({ req, res }) => {
    try {
      const { product_id } = params;
      const Product = req.getModel("Product");
      const Media = req.getModel("Media");

      // Check if file exists in request
      if (!req.files || !req.files.image) {
        return res.status(400).json({
          success: false,
          error: "No image file provided"
        });
      }

      // Get product
      const product = await Product.find(product_id);
      if (!product) {
        return res.status(404).json({
          success: false,
          error: "Product not found"
        });
      }

      // Create media record
      const media = Media.new({
        type: "image",
        fileName: req.files.image.name,
        mimeType: req.files.image.mimetype,
        size: req.files.image.size,
        uploadedBy: req.user.id
      });

      // Save file to storage
      const fileData = req.files.image.data;
      const fileId = await req.storage.saveFile(fileData, {
        fileName: req.files.image.name,
        mimeType: req.files.image.mimetype
      });

      // Update media record with file ID
      media.fileId = fileId;
      await media.save();

      // Update product with media ID
      product.imageId = media.id;
      await product.save();

      return res.json({
        success: true,
        message: "Image uploaded successfully",
        media: await media.transform(true)
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

### User Registration and Authentication

```jsx
module.exports = {
  registerUser: async ({ req, res }) => {
    try {
      const User = req.getModel("User");
      const Role = req.getModel("Role");

      // Validate input
      const { email, password, firstName, lastName } = req.body;

      if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({
          success: false,
          error: "All fields are required"
        });
      }

      // Check if user already exists
      const existingUser = await User.filter({ email: email.toLowerCase() }).first();
      if (existingUser) {
        return res.status(409).json({
          success: false,
          error: "User with this email already exists"
        });
      }

      // Get default role
      const defaultRole = await Role.filter({ key: "user" }).first();

      // Create user
      const user = User.new({
        email: email.toLowerCase(),
        password: await req.auth.hashPassword(password),
        first_name: firstName,
        last_name: lastName,
        roleId: defaultRole.id,
        active: true
      });

      await user.save();

      // Generate token
      const token = await user.generateToken();

      return res.json({
        success: true,
        message: "User registered successfully",
        token: token,
        user: await user.transform(true)
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  loginUser: async ({ req, res }) => {
    try {
      const User = req.getModel("User");

      // Validate input
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: "Email and password are required"
        });
      }

      // Find user
      const user = await User.filter({ email: email.toLowerCase() }).first();

      if (!user) {
        return res.status(401).json({
          success: false,
          error: "Invalid credentials"
        });
      }

      // Verify password
      const isPasswordValid = await req.auth.verifyPassword(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          error: "Invalid credentials"
        });
      }

      // Check if user is active
      if (!user.active) {
        return res.status(403).json({
          success: false,
          error: "Account is inactive"
        });
      }

      // Generate token
      const token = await user.generateToken();

      return res.json({
        success: true,
        message: "Login successful",
        token: token,
        user: await user.transform(true)
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

### Real-time Notifications

```jsx
module.exports = {
  sendNotification: async ({ req, res }) => {
    try {
      const { userId, title, message, type } = req.body;
      const Notification = req.getModel("Notification");

      // Create notification
      const notification = Notification.new({
        userId: userId,
        title: title,
        message: message,
        type: type || "info",
        read: false,
        createdAt: new Date()
      });

      await notification.save();

      // Send real-time notification
      req.notifyUser({
        type: type || "info",
        title: title,
        message: message
      }, userId);

      return res.json({
        success: true,
        message: "Notification sent successfully",
        notification: await notification.transform(true)
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  getMyNotifications: async ({ req, res }) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: "Unauthorized"
        });
      }

      const Notification = req.getModel("Notification");

      // Get unread count
      const unreadCount = await Notification.count({
        userId: req.user.id,
        read: false
      });

      // Get notifications with pagination
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;

      const notifications = await Notification.filter({ userId: req.user.id })
        .orderBy("createdAt", "desc")
        .skip((page - 1) * limit)
        .limit(limit)
        .run();

      // Transform to JSON
      const transformedNotifications = await notifications.transform(true);

      return res.json({
        success: true,
        data: transformedNotifications,
        unreadCount: unreadCount
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  markNotificationAsRead: async ({ req, res }) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: "Unauthorized"
        });
      }

      const { notification_id } = params;
      const Notification = req.getModel("Notification");

      // Find notification
      const notification = await Notification.find(notification_id);

      if (!notification) {
        return res.status(404).json({
          success: false,
          error: "Notification not found"
        });
      }

      // Check ownership
      if (notification.userId.toString() !== req.user.id.toString()) {
        return res.status(403).json({
          success: false,
          error: "Forbidden"
        });
      }

      // Mark as read
      notification.read = true;
      await notification.save();

      return res.json({
        success: true,
        message: "Notification marked as read"
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

By understanding these patterns and examples, you should be able to create any type of controller function in the CyberOcean framework. Remember to follow the established patterns for consistency and maintainability.