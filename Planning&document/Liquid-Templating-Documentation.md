# Liquid Templating Documentation for MonoCommerce

## 1. Introduction to Liquid

Liquid is a template language created by Shopify and used in many eCommerce platforms. In MonoCommerce, we use Liquid to separate presentation from logic in templates. Liquid contains two types of markup:

- **Output markup**: Uses double curly braces `{{ }}` to output dynamic content
- **Tag markup**: Uses curly braces and percentage signs `{% %}` for logic and control flow

## 2. Common Liquid Tags and Filters

### Objects

```
{{ product.title }}               <!-- Outputs product title -->
{{ collection.products.size }}    <!-- Outputs number of products in a collection -->
{{ cart.total_price | money }}    <!-- Outputs cart total formatted as money -->

```

### Control Flow

```
{% if product.available %}
  In stock
{% else %}
  Sold out
{% endif %}

{% for product in collection.products %}
  {{ product.title }}
{% endfor %}

```

### Comments

```
{% comment %}
  This is a comment that won't be rendered
{% endcomment %}

```

## 3. MonoCommerce-Specific Settings

### Global Settings

These settings are available across all templates:

| Setting | Description | Usage Example |
| --- | --- | --- |
| `shop.name` | The store name | `{{ shop.name }}` |
| `shop.email` | The store email | `{{ shop.email }}` |
| `shop.domain` | The store domain | `{{ shop.domain }}` |
| `shop.currency` | The store currency | `{{ shop.currency }}` |

### Template-Specific Settings

### Product Page Settings

```
{{ product.title }}        <!-- Product title -->
{{ product.description }}  <!-- Product description -->
{{ product.price }}        <!-- Product price -->
{{ product.images }}       <!-- Product images -->
{{ product.variants }}     <!-- Product variants -->

```

### Collection Page Settings

```
{{ collection.title }}         <!-- Collection title -->
{{ collection.description }}   <!-- Collection description -->
{{ collection.products }}      <!-- Products in the collection -->

```

## 4. Settings Replacement Guide

When adapting templates, follow these guidelines for replacing settings:

### Basic Settings Replacement

1. Identify the setting in the template: `{{ setting.color_scheme }}`
2. Replace with a static value or reference to your own data structure: `{{ theme.color_scheme }}`

### Advanced Replacement

For more complex settings like filters or design layouts:

1. Identify the setting pattern: `{% if settings.show_vendor %}{{ product.vendor }}{% endif %}`
2. Replace with your own implementation: `{% if config.display_options.vendor %}{{ product.vendor }}{% endif %}`

## 5. Product Filtering Implementation

### Filter by Collection

```
{% assign filtered_products = products | where: "collection_ids", collection.id %}
{% for product in filtered_products %}
  {{ product.title }}
{% endfor %}

```

### Filter by Price Range

```
{% assign price_min = price_min | default: 0 %}
{% assign price_max = price_max | default: 1000000 %}
{% assign filtered_products = products | where_exp: "product", "product.price >= price_min and product.price <= price_max" %}

```

### Filter by Attribute

```
{% assign filtered_products = products | where: "color", "blue" %}

```

## 6. API Integration in Templates

### Fetching Products

```
{% assign products = api.get("@PA/products/list") %}
{% for product in products %}
  {{ product.title }} - {{ product.price | money }}
{% endfor %}

```

### Submitting Forms

```
<form action="{{ "@PA/cart/add" | absolute_url }}" method="post">
  <input type="hidden" name="product_id" value="{{ product.id }}">
  <input type="number" name="quantity" value="1" min="1">
  <button type="submit">Add to Cart</button>
</form>

```

## 7. Best Practices

1. **Keep templates DRY** - Use includes and snippets for reusable components
2. **Minimize logic in templates** - Move complex logic to controllers
3. **Use consistent naming** - Follow a naming convention for variables and includes
4. **Comment your code** - Add comments for complex sections
5. **Optimize for performance** - Minimize loops and conditional statements