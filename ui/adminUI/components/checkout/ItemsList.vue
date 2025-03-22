<template>
	<div class="items-list">
		<div v-for="item in items" class="item-item">
			<img :src="item.data.image.path" />
			<span class="quantity">{{ item.quantity }}</span>
			<span class="separator"></span>
			<span class="item-name">
        <span>{{ item.data.name }}</span>
        <div v-if="item.type == 'VARIANTS_PRODUCT'" style="display: flex; flex-flow: wrap;">
          <span
            v-for="op in item.product.optionsData"
            class="item-name-options"
          >
            <b>{{op.name}}:</b> {{item.data.selectedVariantOptions[op.id] || "ERROR" }}
          </span>
        </div>
      </span>
			<span class="price-total">{{ item.price }}</span>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		items: {
			required: true,
		},
	},
}
</script>

<style>
.items-list {
	max-height: 50vh;
	overflow-y: auto;
  border-bottom: 2px solid #e2e2e2;
	margin-bottom: 10px;
}
.items-list .item-item {
	position: relative;
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  margin: 7px 0px;
  /* border-bottom: 1px solid #e2e2e2; */
  padding-bottom: 5px;
}
.items-list .item-item img {
  width: 65px;
  height: 65px;
  border-radius: 5px;
  margin: 5px;
	box-shadow: 0px 0px 3px gray;
	/* border: 1px solid gray; */
}
.items-list .item-item .separator {
  border-right: 1px solid #e2e2e2;
  height: 70px;
  margin-left: 10px;
}
.items-list .item-item .quantity {
	position: absolute;
	color: white;
	background-color: grey;
	left: 60px;
	/* top: 7px; */
	font-size: 0.85em;
  /* font-size: 15px; */
  font-weight: 400;
  padding: 0px 5px;
  height: 20px;
  min-width: 20px;
  display: flex;
  align-items: center;
  border: 1px solid grey;
	border-radius: 100%;
  margin-top: -40px;
}
.items-list .item-item .item-name {
	font-weight: 400;
  flex-grow: 1;
	font-size: 1em;
  /* font-size: 20px; */
  margin-left: 5px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.items-list .item-item .price {
	word-wrap: none;
  font-size: 17px;
  margin-right: 5px;
  padding-top: 3px;
  padding-left: 5px;
  /* border-left: 1px solid #e2e2e2; */
  height: 100px;
  display: flex;
  align-items: center;
	white-space: nowrap;
}
.items-list .item-item .price-total {
  /* font-weight: bold; */
  /* font-size: 20px; */
	font-weight: 500;
	font-size: 1em;
	white-space: nowrap;
	margin-left: 20px;
}
.item-name-options{
  border: 1px dashed #424242;
  padding: 0px 4px;
  border-radius: 4px;
  margin-top: 2px;
  margin-right: 2px;
  display: inline-block;
  font-size: 14px;
}
</style>