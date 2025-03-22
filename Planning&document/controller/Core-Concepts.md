# CyberOcean Framework: Core Concepts and Architecture

This comprehensive guide explains the fundamental concepts and architecture of the CyberOcean framework without code examples, providing a deep understanding of how the framework operates and how to leverage its capabilities effectively.

## Table of Contents

1. [Framework Architecture]
2. [Controller Function Structure]
3. [Request and Response Handling]
4. [Data Models and ORM]
5. [Authentication and Authorization]
6. [Caching System]
7. [Nested Calls]
8. [Transaction Management]
9. [Real-time Notifications]
10. [Internationalization]
11. [Templating with Liquid]
12. [Performance Optimization]

---

## Framework Architecture

### Overview

CyberOcean is a modular, controller-based framework designed for building scalable web applications and APIs. It follows a modified MVC (Model-View-Controller) architecture with additional components for caching, authentication, and real-time communication.

### Core Components

1. **Controllers**: Handle business logic and process requests
2. **Models**: Represent data structures and database interactions
3. **Services**: Provide reusable functionality across controllers
4. **Middleware**: Process requests before they reach controllers
5. **Utils**: Utility functions for common operations
6. **Caching Layer**: Optimizes performance through data caching
7. **Authentication System**: Manages user identity and sessions
8. **Storage System**: Handles file uploads and management
9. **Notification System**: Manages real-time communication

### Request Lifecycle

1. The client sends a request to the server
2. Middleware processes the request (authentication, validation, etc.)
3. The router directs the request to the appropriate controller function
4. The controller function processes the request, interacting with models and services as needed
5. The controller function returns a response
6. Middleware processes the response
7. The response is sent back to the client

### Dependency Injection

CyberOcean uses a dependency injection pattern to provide controllers with access to various framework components:

- `req`: The request object, which includes access to models, authentication, caching, etc.
- `res`: The response object for sending data back to the client
- `params`: URL and query parameters
- `utils`: Utility functions

---

## Controller Function Structure

### Function Signature

Controller functions in CyberOcean follow a consistent structure:

```
functionName: async ({ req, res, params, utils }) => { ... }

```

### Controller Organization

Controllers are organized as modules with multiple related functions. Each controller typically handles a specific domain of functionality (e.g., ProductController, UserController).

### Controller Registration

Controllers are automatically registered in the framework and made available through the `getController` function, which allows controllers to call functions in other controllers.

### Function Types

1. **Public Functions**: Accessible via API endpoints
2. **Private Functions**: Used internally within controllers
3. **Nested Functions**: Can be called by other controller functions

### Error Handling

Controller functions should implement proper error handling using try-catch blocks. The framework provides standardized error response formats for consistency.

---

## Request and Response Handling

### Request Object (`req`)

The request object provides access to:

1. **HTTP Information**: Method, headers, IP address
2. **Parameters**: URL parameters, query parameters, body data
3. **User Information**: Current authenticated user
4. **Models**: Database models via `req.getModel()`
5. **Caching**: Cache operations via `req.getCache()`, `req.setCache()`, etc.
6. **Authentication**: Auth functions via `req.auth`
7. **Storage**: File storage via `req.storage`
8. **Settings**: Application settings via `req.settings`
9. **Internationalization**: Translation functions via `req.__()`

### Response Object (`res`)

The response object provides methods for sending data back to the client:

1. **JSON Responses**: `res.json()`
2. **Status Codes**: `res.status()`
3. **Redirects**: `res.redirect()`
4. **HTML Rendering**: `res.render()`
5. **File Downloads**: `res.download()`
6. **Headers**: `res.setHeader()`

### Parameters

Parameters are passed to controller functions and include:

1. **URL Parameters**: Defined in route paths (e.g., `/products/:product_id`)
2. **Query Parameters**: Appended to the URL (e.g., `?page=1&limit=20`)
3. **Body Parameters**: Sent in the request body for POST, PUT, PATCH requests

---

## Data Models and ORM

### Model Definition

Models in CyberOcean represent database entities and provide an Object-Relational Mapping (ORM) layer for interacting with the database.

### Accessing Models

Models are accessed through the request object using `req.getModel("ModelName")`.

### Model Operations

1. **Creating Records**: `Model.new()` followed by `save()`
2. **Reading Records**: `Model.find()`, `Model.filter()`, `Model.all()`
3. **Updating Records**: Modifying properties followed by `save()`
4. **Deleting Records**: `record.delete()`
5. **Querying**: Complex queries using `filter()`, `orderBy()`, `limit()`, etc.
6. **Aggregations**: Counting, grouping, and other aggregations
7. **Relationships**: Handling one-to-one, one-to-many, and many-to-many relationships

### Data Transformation

The `transform()` method converts model instances to JSON, optionally including related data. This is crucial for preparing data to be sent to clients.

### Validation

Models can include validation rules to ensure data integrity before saving to the database.

---

## Authentication and Authorization

### Authentication System

CyberOcean provides a comprehensive authentication system:

1. **User Management**: Creating, updating, and deleting user accounts
2. **Password Handling**: Secure password hashing and verification
3. **Token Generation**: Creating and validating authentication tokens
4. **Session Management**: Tracking user sessions

### Authorization

Authorization determines what authenticated users can do:

1. **Role-Based Access Control**: Users have roles that determine their permissions
2. **Permission Checking**: Controllers check if users have permission to perform actions
3. **Resource Ownership**: Verifying that users have access to specific resources

### User Context

The authenticated user is available in controller functions via `req.user`, providing access to:

1. **User ID**: `req.user.id`
2. **User Role**: `req.user.role`
3. **User Permissions**: `req.user.permissions`
4. **User Metadata**: Other user-specific information

---

## Caching System

### Cache Operations

CyberOcean provides a powerful caching system to optimize performance:

1. **Setting Cache**: `req.setCache(key, value, options)`
2. **Getting Cache**: `req.getCache(key)`
3. **Deleting Cache**: `req.deleteCache(key)`
4. **Group-Based Cache**: `req.deleteCacheByGroup(groupName)`

### Cache Options

When setting cache, various options can be specified:

1. **TTL (Time to Live)**: How long the cache should be valid
2. **Group**: Assigning the cache to a group for easier invalidation
3. **Scope**: Determining the visibility of the cache (global, user, session)

### Cache Strategies

Effective caching strategies in CyberOcean include:

1. **Resource Caching**: Caching frequently accessed resources
2. **Query Result Caching**: Caching the results of expensive database queries
3. **Computed Value Caching**: Caching the results of complex calculations
4. **Partial Response Caching**: Caching parts of responses that don't change frequently

### Cache Invalidation

Cache invalidation is crucial for maintaining data consistency:

1. **Time-Based Invalidation**: Cache expires after a set time
2. **Event-Based Invalidation**: Cache is invalidated when data changes
3. **Group-Based Invalidation**: All cache entries in a group are invalidated together
4. **Manual Invalidation**: Explicitly deleting cache entries

---

## Nested Calls

### Concept

Nested calls allow controller functions to call other controller functions directly, enabling code reuse and modular design.

### Implementation

Nested calls are implemented using the `getController` function to access other controllers, then calling their functions with the `nestedCall` flag.

### Context Passing

When making nested calls, context is passed through the `nestedArgs` parameter, allowing the called function to access the necessary data.

### Return Values

Unlike public controller functions that send HTTP responses, nested functions return data directly to the calling function.

### Use Cases

1. **Shared Logic**: Reusing common logic across multiple controller functions
2. **Complex Operations**: Breaking down complex operations into smaller, reusable functions
3. **Cross-Controller Functionality**: Accessing functionality from different controllers
4. **Helper Functions**: Creating utility functions specific to controller operations

---

## Transaction Management

### Database Transactions

CyberOcean supports database transactions for operations that require atomicity:

1. **Starting Transactions**: `req.startTransaction()`
2. **Committing Transactions**: `session.commitTransaction()`
3. **Aborting Transactions**: `session.abortTransaction()`

### Transaction Scope

Transactions can span multiple operations across different models, ensuring data consistency.

### Error Handling

Proper error handling is crucial in transactions to ensure they are properly committed or aborted.

---

## Real-time Notifications

### Notification System

CyberOcean includes a real-time notification system for communicating with clients:

1. **User Notifications**: `req.notifyUser()`
2. **Role Notifications**: `req.notifyByRoles()`
3. **Broadcast Notifications**: `req.notifyAll()`

### Notification Types

Different types of notifications can be sent:

1. **Info**: General information
2. **Success**: Successful operations
3. **Warning**: Potential issues
4. **Error**: Error conditions

### Notification Persistence

Notifications can be persisted in the database for later retrieval, or sent as transient real-time messages.

---

## Internationalization

### Translation System

CyberOcean supports internationalization through a translation system:

1. **Translating Text**: `req.__("key")`
2. **Setting Language**: Based on user preferences or request headers
3. **Translation Files**: Organized by language code

### Localization

Beyond simple translation, the framework supports localization of:

1. **Dates and Times**: Formatting according to local conventions
2. **Numbers and Currencies**: Using appropriate formats and symbols
3. **Units of Measurement**: Converting between different systems

---

## Templating with Liquid

### Liquid Engine

CyberOcean uses the Liquid templating engine for rendering HTML:

1. **Rendering Views**: `utils.liquidView()`
2. **Rendering Partials**: Including reusable template parts
3. **Loading Data**: `utils.loadLiquidData()`

### Template Organization

Templates are organized into:

1. **Layouts**: Define the overall structure of pages
2. **Pages**: Specific page templates
3. **Partials**: Reusable template components
4. **Blocks**: Content blocks that can be included in multiple places

### Template Data

Data is passed to templates from controller functions, making it available for rendering.

---

## Performance Optimization

### Query Optimization

CyberOcean provides tools for optimizing database queries:

1. **Selective Field Retrieval**: `select()` to retrieve only needed fields
2. **Indexing**: Creating and using database indexes
3. **Query Planning**: Analyzing and optimizing query execution plans

### Caching Strategies

Strategic caching is crucial for performance:

1. **Resource Caching**: Caching frequently accessed resources
2. **Query Result Caching**: Caching expensive query results
3. **Fragment Caching**: Caching parts of rendered pages

### Batch Processing

For operations involving multiple records:

1. **Bulk Operations**: Processing multiple records in a single operation
2. **Chunking**: Breaking large operations into smaller chunks
3. **Background Processing**: Moving time-consuming operations to background jobs

### Monitoring and Profiling

CyberOcean includes tools for monitoring and profiling:

1. **Performance Metrics**: Tracking execution times and resource usage
2. **Query Profiling**: Analyzing database query performance
3. **Cache Hit Rates**: Monitoring cache effectiveness

---

By understanding these core concepts and architectural principles, you'll be well-equipped to leverage the full power of the CyberOcean framework for building robust, scalable applications.