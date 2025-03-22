<template>
  <div>
    <div class="mb-2" style="font-size: 18px">
      <b><v-icon color="red" size="32" class="mr-2">mdi-list</v-icon>{{ $t("products.specifications") }}</b>
    </div>
    <v-divider class="mb-4"></v-divider>
    <CLoader
      cpn="KhaField"
      :schema="schema"
      :value="value.specificationsData || []"
      @input="update('specificationsData', $event)"
      :label="$t('products.specifications')"
      class="product-specifications-wrapper"
    />
  </div>
</template>

<script>
//TODO List Collections
//TODO Tags Creator
export default {
  props: {
    value: {
      required: true,
    },
  },
  data() {
    return {
    };
  },
  computed: {
    schema(){
      return {
        type: "list",
        sortable: true,
        maxItems: 100,
        centerDragButton: false,
        askToRemove: true,
        XXXcontentClass: "product-specifications-items-wrapper",
        itemSchema: {
          type: "group",
          addClass: "mb-0",
          expansion: true,
          defaultExpansion: false,
          label: "{name} <b style='font-size: 20px; font-family: monospace;'>→</b> {value}",
          schema: {
            name: {
              type: "text",
              label: this.$t("name"),
              dense: true,
              hideDetails: true,
              outlined: true,
            },
            value: {
              type: "text",
              label: this.$t("value"),
              addClass: "mt-1 mb-1",
              dense: true,
              hideDetails: true,
              outlined: true,
            },
          },
        },
      };
    },
  },
  methods: {
    update(key, val) {
      var obj = {
        ...this.value,
        [key]: val,
      };
      this.$emit("input", obj);
    },
  },
};
</script>

<style>
.product-specifications-wrapper{
  max-height: 450px;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>