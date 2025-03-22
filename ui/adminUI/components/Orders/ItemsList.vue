<template>
	<div class="items-list">
		<div v-for="item in items" class="item-item" @click.self="enableUpdateQuantityField(item)">
			<img :src="(item.data.image && item.data.image.path) || '/images/item_cube.png'" style="padding: 7px;" @click.self="enableUpdateQuantityField(item)" />
			<span class="quantity">{{ item.quantity }}</span>
			<span class="separator"></span>
			<span v-if="updateQuantityField != item.id" class="item-name" @click.self="enableUpdateQuantityField(item)">
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
			<span v-if="updateQuantityField != item.id" class="price-total" @click.self="enableUpdateQuantityField(item)">{{ item.price }}</span>
			<span v-if="editable && (updateQuantityField != item.id)" class="update-quantity" @click.self="enableUpdateQuantityField(item)">x {{ item.quantity }}</span>
      <v-spacer v-if="updateQuantityField == item.id"></v-spacer>
			<span v-if="updateQuantityField == item.id" class="update-quantity-inputs d-flex">
        <v-btn
          small
          color="primary"
          class="ma-auto"
          style="text-transform: none;"
          outlined
          @click.prevent="disableUpdateQuantityField()"
        >
          <v-icon left>mdi-cancel</v-icon>
          {{$t('common.cancel')}}
        </v-btn>
        <v-btn
          small
          color="primary"
          class="ma-auto ml-2"
          style="text-transform: none;"
          @click.prevent="emitUpdatedQuantity(item)"
        >
          <v-icon left>mdi-content-save</v-icon>
          {{$t('common.save')}}
        </v-btn>
        <Number
          v-model="updateQuantityValue"
          autofocus
          class="mr-2 ml-2"
          min="1"
          :max="(item.variant.trackQuantity && !item.variant.continueOutOfStock) ? item.variant.quantity : 0"
        />
      </span>
			<span v-if="editable" @click.prevent="$emit('deleteItem', item)" class="delete-item"><v-icon color="inherit">mdi-close</v-icon></span>
		</div>
    <div v-if="editable" class="d-flex mb-2">
      <v-spacer></v-spacer>
      <v-btn
        outlined
        color="primary"
        class="ma-auto ml-2"
        style="text-transform: none;"
        @click.prevent="$emit('addItem')"
      >
        <v-icon left>mdi-plus-circle-multiple</v-icon>
        {{$t('orders.add-item-to-order')}}
      </v-btn>
    </div>
	</div>
</template>

<script>
import Number from "@/components/Fields/Number.vue";

export default {
  components: {
    Number,
  },
	props: {
		items: {
			required: true,
		},
		editable: {
      type: Boolean,
      default: false,
		},
	},
  data() {
    return {
      updateQuantityField: null,
      updateQuantityValue: 0,
    };
  },
  methods: {
    enableUpdateQuantityField(item){
      if(!this.editable) return;
      this.updateQuantityField = item.id;
      this.updateQuantityValue = item.quantity;
    },
    disableUpdateQuantityField(){
      this.updateQuantityField = null;
    },
    emitUpdatedQuantity(item){
      this.updateQuantityField = null;
      this.$emit('updateQuantity', {
        item,
        quantity: this.updateQuantityValue,
      });
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
  /* padding-right: 1px; */
}
.items-list .item-item {
	position: relative;
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  margin: 7px 0px;
  /* border-bottom: 1px solid #e2e2e2; */
  padding-bottom: 5px;
  max-width: 97%;
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
.items-list .item-item .update-quantity {
	color: white;
	/* background-color: rgb(132, 187, 99); */
	background-color: var(--v-success-darken3);
  opacity: 0.6;
	font-size: 0.9em;
  /* font-size: 15px; */
  font-weight: bold;
  padding: 1px 5px;
  /* height: 20px; */
  /* min-width: 20px; */
  /* display: flex; */
  /* align-items: center; */
  /* border: 1px solid grey; */
	border-radius: 7px;
	margin-left: 10px;
  cursor: pointer;
  min-width: fit-content;
}
.items-list .item-item .update-quantity:hover {
	background-color: var(--v-success-base);
  opacity: 1;
}
.items-list .item-item .delete-item .v-icon {
  color: inherit;
  position: absolute;
  font-size: 20px;
  margin-left: 1px;
  margin-top: 2px;
}
.items-list .item-item .delete-item {
  margin-left: 5px;
  position: relative;
  cursor: pointer;
  background-color: var(--v-primary-darken3);
  opacity: 0.6;
  border-radius: 100%;
  width: 23px;
  height: 23px;
  color: white;
  display: flex;
  /* justify-content: center; */
  padding: 0px;
  margin-top: 0px;
  min-width: 23px;
}
.items-list .item-item .delete-item:hover {
	background-color: var(--v-primary-base);
  opacity: 1;
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