<template>
  <v-overlay v-if="loading" xabsolute yabsolute z-index="10" :value="true">
    <v-progress-circular color="white" indeterminate size="64">
    </v-progress-circular>
  </v-overlay>
  <div v-else :class="{ 'product-addedit': true, 'main-layout': mode != '' }">
    <CLoader
      cpn="ConfirmDialog"
      ref="confirmDialog"
      buttonsColor="warning"
      titleColor="var(--v-warning-base)"
      titleDark="true"
      shaped
    >
    </CLoader>
    <v-row style="display: flex">
      <CLoader
        cpn="Breadcrumb"
        :title="$t('sidebar.edit-product')"
        :items="breadcrumb"
        class="mb-7 mt-3"
      >
        <template v-slot:homeIcon>
          <img
            src="/images/store.png"
            style="width: 17px; margin-bottom: -1px"
          />
        </template>
        <template v-slot:titleIcon>
          <img
            src="/images/tag.png"
            style="width: 45px; margin-bottom: -10px"
          />
        </template>
      </CLoader>
      <v-spacer />
      <span
        v-if="!productPickerMode"
        class="mt-6"
        style="margin-left: auto; margin-bottom: 20px"
      >
        <v-btn color="primary" @click="saveProduct">
          <v-icon class="mr-1">mdi-content-save</v-icon>
          <span style="text-transform: none">{{
            $t("products.save-product")
          }}</span>
        </v-btn>
      </span>
    </v-row>
    <ProductAddEdit
      ref="addForm"
      v-model="product"
      :initalMode="mode"
      @modeChange="mode = $event"
      editMode
    />
    <div v-if="!productPickerMode" class="footer-section">
      <v-divider class="mt-5 mb-5"></v-divider>
      <div style="display: flex">
        <v-spacer />
        <v-btn color="primary" @click="saveProduct">
          <v-icon class="mr-1">mdi-content-save</v-icon>
          <span style="text-transform: none">{{
            $t("products.save-product")
          }}</span>
        </v-btn>
      </div>
    </div>
   
  </div>
</template>

<script>
import ProductAddEdit from "@/components/Products/ProductAddEdit";

export default {
  data() {
    return {
      loading: true,
      finished: false,
      mode: "",
      product: null,
      rawProductCopy: "",
      path:"",
    };
  },
  components: {
    ProductAddEdit,
  },
  async mounted() {
    $nuxt?.$pluginsBus?.$emit("module_products_edit_ready", this);

    this.asyncData({params: this.params , store: this.$store});
  },
  computed: {
    productPickerMode() {
      return this.mode == "";
    },
    breadcrumb() {
      return [
        {
          text: this.$t("sidebar.products"),
          to: "@PV/products",
          disabled: false,
        },
        {
          text: this.$t("sidebar.edit-product"),
          to: "@PV/products/" + this.params.id,
          disabled: true,
        },
      ];
    },
  },
  watch: {
    product: {
      deep: true,
      handler() {
        this.finished = false;
      },
    },
  },
  methods: {
    async asyncData() {
      await this.$store.dispatch("auth/waitUntilLoaded");
      var product = await this.$store.dispatch("products/getProductById", this.params.id);
      var rawProductCopy = JSON.stringify(product);
      product = JSON.parse(rawProductCopy);


        this.loading = false;
        this.finished = true;
        this.mode = product.type;
        console.log("product" , product);
        console.log("mode" , product.type);
        console.log('this mode' , this.mode);
        
        
        this.product = product; // Use product directly if JSON ops are removed
        this.rawProductCopy = rawProductCopy; // Remove if not needed
    },
    async beforeRouteLeave(to, from, next) {
      if (this.finished || this.mode == "" || this.noAtomicChanges()) {
        next();
        return;
      }
      // if(confirm("Are you sure to leave, You may have unsaved data ?")) {
      if (
        await this.$refs.confirmDialog.cp.confirm(
          this.$t("products.unsaved-changes"),
          this.$t("products.unsaved-changes-message")
        )
      ) {
        next();
      } else {
        next(false);
      }
    },
    noAtomicChanges() {
      return JSON.stringify(this.product) == this.rawProductCopy;
    },
    async saveProduct() {
      if (!this.$refs.addForm.validate()) {
        this.$toast.warning(
          this.$t("notifications.some-fields-are-not-complete")
        );
        return;
      }
      this.loading = true;

      try {
        await this.$store.dispatch("products/edit_product", this.product);
        this.$toast.success(this.$t("notifications.product-is-saved"));
        this.finished = true;
        // this.$router.push("/products");
        this.$router.go(-1);
      } catch (error) {
        this.$toast.error(this.$t("notifications.product-is-not-saved"));
      }

      this.loading = false;
    },
  },
};
</script>

<style >
.product-addedit .footer-section {
  position: relative;
  width: 100%;
  margin-bottom: 50px;
}

.product-addedit .main-section {
}

.product-addedit .main-section .v-card {
  margin-top: 20px;
  padding: 20px;
}

.product-addedit .side-section {
}

.product-addedit .side-section .v-card {
  margin-top: 20px;
  padding: 20px;
}

.product-addedit .parent-section {
  display: flex;
  flex-wrap: wrap;
  margin-right: -15px;
  margin-left: -15px;
}

@media (min-width: 1060px) {
  .product-addedit .side-section {
    flex: 0 0 35%;
    max-width: 35%;
    position: relative;
    width: 100%;
    padding-left: 20px;
  }
  .product-addedit .main-section {
    flex: 0 0 65%;
    max-width: 65%;
    position: relative;
    width: 100%;
  }
  .rtl-is-active .product-addedit .side-section {
    padding-left: 0px !important;
    padding-right: 20px !important;
  }
}

@media (max-width: 1060px) {
  .product-addedit .side-section {
    width: 100%;
  }
  .product-addedit .main-section {
    width: 100%;
  }
}
.main-layout {
  max-width: 935px;
  margin-left: calc((100% - 935px) / 2);
}

@media (max-width: 1270px) {
  .main-layout {
    margin-left: 0px;
  }
}

@media (max-width: 550px) {
}
</style>