# CyberOcean Documentation: Creating Models from Scratch

## 1. Purpose and Functionality

This guide explains how to create new database models from scratch in the CyberOcean framework. Models define the structure and relationships for data stored in the application.

## 2. Model Structure and Configuration

### Basic Model Structure

New models are created as JSON files in the `config/database/models` directory with the following structure:

```json
{
  "model": "ModelName",
  "table": "model_names",
  "attributes": {
    "version": "1.0.0",
    "field1": null,
    "field2": "",
    "field3": 0,
    "field4": false,
    "arrayField": []
  },
  "options": {
    "relations": {
      // Relationship definitions
    },
    "indexes" : ["field1" , "field2"]
  }
}


```

### Setting Default Values

Define default values for each attribute:

- Use `null` for optional fields with no default
- Use `""` for empty strings
- Use `0` for numeric values
- Use `false` for boolean values
- Use `[]` for empty arrays
- Use `{}` for empty objects

### Special Configuration Options

Additional options can be specified:

```json
{
  "model": "ModelName",
  "table": "model_names",
  "replaceOnUpdate": false,
  "attributes": {
    // Attributes definition
  },
  "options": {
    // Options definition
  }
}

```

The `replaceOnUpdate` flag determines if the entire document should be replaced during updates.

## 3. Defining Relationships

CyberOcean supports several relationship types:

### BELONGS_TO Relationship

```json
"fieldId": {
  "type": "BELONGS_TO",
  "model": "RelatedModel",
  "byId": true,
  "jsonField": "field"
}

```

### BELONGS_TO_MANY Relationship

```json
"fieldsIds": {
  "type": "BELONGS_TO_MANY",
  "model": "RelatedModel",
  "byId": true,
  "jsonField": "fields"
}

```

### HAS_MANY Relationship

```json
"childrenIds": {
  "type": "HAS_MANY",
  "model": "ChildModel",
  "byId": true,
  "jsonField": "children"
}

```

### HAS_ONE Relationship

```json
"profileId": {
  "type": "HAS_ONE",
  "model": "Profile",
  "byId": true,
  "jsonField": "profile"
}

```

## 4. Model Naming Conventions

Follow these conventions when creating models:

- **Model name**: PascalCase singular (e.g., `User`, `Product`, `OrderItem`)
- **Table name**: snake_case plural (e.g., `users`, `products`, `order_items`)
- **Relationship fields**:
    - For single relationships: `modelNameId` (e.g., `userId`, `categoryId`)
    - For multiple relationships: `modelNamesIds` (e.g., `tagsIds`, `productItemsIds`)

## 5. Data Types and Field Definitions

### Common Data Types

- String: `"fieldName": null` or `"fieldName": ""`
- Number: `"fieldName": 0`
- Boolean: `"fieldName": false`
- Array: `"fieldName": []`
- Object: `"fieldName": {}`
- Date: Stored as timestamp number, typically initialized with `0`

### Field Documentation

Use comments to document fields:

```json
{
  "attributes": {
    "title": null, // Title of the product
    "price": 0, // Price in default currency
    "isActive": false, // Whether the product is available
    "tags": [] // Array of tag IDs
  }
}

```

## 6. Advanced Model Configuration

### Add Hooks and Validators

You can describe lifecycle hooks in your model documentation:

```json
{
  "model": "Product",
  "table": "products",
  "hooks": {
    "beforeSave": "validateProduct"
  },
  "attributes": {
    // Attributes definition
  }
}

```

### Custom Fields and Computed Properties

Document any computed properties or virtual fields:

```json
{
  "attributes": {
    "firstName": "",
    "lastName": "",
    // fullName is computed from firstName + lastName
    "dateCreated": 0 // Unix timestamp
  }
}

```

## 7. Optimization Opportunities

### Potential Bugs or Issues

- Avoid circular dependencies between models
- Don't use reserved words as field names
- Use consistent naming patterns for related fields

### Areas for Optimization

- Group related models in subdirectories for organization
- Create index definitions for frequently queried fields
- Use enumeration comments for fields with fixed value sets

### Missing Error Handling

- Include validation rules in documentation
- Document required fields versus optional fields
- Include constraints and validation rules

### Security Concerns

- Avoid storing sensitive data in plain text
- Document fields that need encryption
- Define access control at the model level

### Performance Bottlenecks

- Limit the number of relationship fields
- Document fields that should be indexed
- Avoid deeply nested objects when possible

## Recommendations

- Create a template file for new models
- Document all relationships between models in a central document
- Include examples of common usage patterns
- Maintain version control for model definitions
- Use a consistent pattern for ID fields
- Group models by domain or functionality
- Document any special behavior or business logic