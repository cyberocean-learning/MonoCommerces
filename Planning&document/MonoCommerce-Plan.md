# MonoCommerce Rebuild Project Plan

## Project Overview

The goal is to rebuild an eCommerce website called MonoCommerce using the CyberOcean framework. This plan outlines the project structure, requirements, and implementation steps without exposing the underlying web eCommerce builder.

## Project Components

### 1. Project Structure

```
MonoCommerce/
├── adminUI/
│   ├── pages/
│   │   └── [website_id]/
│   │       ├── products/
│   │       ├── collections/
│   │   
│   └── public_pages/
├── api/
│   ├── routes.js
│   └── controllers/
├── web/
│   └── routes.js
├── config/
│   └── database/
│       └── models/
└── static/

```

### 2. Data Models

Core models to implement:

- WebsiteUser
- WebsiteProduct
- WebsiteCollection
- Website

### 3. Implementation Phases

### Phase 1: Project Setup & Documentation

- Set up the CyberOcean framework
- Study existing structure from ecom_x and main_x projects
- Document model architecture
- Document Liquid templating system and settings

### Phase 2: Admin UI Implementation

- Create owner-specific admin pages (products, collections)
- Remove all settings from layout pages
- Implement admin authentication/authorization

### Phase 3: API Development

- Implement controllers for core functionality
- Develop custom API endpoints for:
    - Product management (par website _id ) “@PA/domainId/products” : domainId the key will search with it
    - Collection management (par website _id )
    - User management (par website _id )

### Phase 4: Frontend Development

- Copy and adapt public pages from ecom_x ( just the product and and collection without variant )
- Modify templates to use custom API endpoints
- Implement product filtering

### Phase 5: Testing & Documentation

- Test all functionalities
- Document all components, APIs, and settings

## Detailed Implementation Guidelines

### Admin UI Development

1. Copy the structure from ecom_x project's adminUI folder
2. Create a new folder with the site owner's ID
3. Implement the following pages:
    - Product management page
    - Collection management page
    - Variant management page
4. Remove all settings from layout pages
5. Document the purpose of each Liquid tag and setting

### API Development

1. Create routes in `api/routes.js` following this pattern:

```jsx
{
  route: "/:websiteId/products/list",
  method: "get",
  action: "listProducts@ProductController",
  permittedRoles: ["root", "admin"],
}

```

1. Implement controllers with necessary functions:
    - ProductController: CRUD operations for products
    - CollectionController: CRUD operations for collections
    - VariantController: CRUD operations for variants
    - UserController: User management functions

### Model Implementation

1. Study the models from the existing architecture
2. Create JSON model files in `config/database/models` for:
    - User.json
    - Product.json
    - Collection.json

### Liquid Templating

1. Document how Liquid templating works
2. Identify and document all settings used in templates
3. Create a simple replacement guide for template customization

## Technology Stack

- Backend: CyberOcean framework (Node.js based)
- Database: MongoDB (accessed through CyberOcean models)
- Frontend: Liquid templates, Vue.js
- Authentication : CyberOcean built-in auth ( only for website creator )
- Authentication  for website users : JWT ( json web token )