<template>
  <div :class="{ 'product-addedit': true, 'main-layout': mode != '' }">
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
        :title="$t('sidebar.add-product')"
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
        <v-btn
          :disabled="$refs.addForm.loading"
          :loading="$refs.addForm.loading"
          color="primary"
          @click="saveProduct"
        >
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
      @modeChange="mode = $event"
    />
    <div v-if="!productPickerMode" class="footer-section">
      <v-divider class="mt-5 mb-5"></v-divider>
      <div style="display: flex">
        <v-spacer />
        <v-btn
          :disabled="$refs.addForm.loading"
          :loading="$refs.addForm.loading"
          color="primary"
          @click="saveProduct"
        >
          <v-icon class="mr-1">mdi-content-save</v-icon>
          <span style="text-transform: none">{{
            $t("products.save-product")
          }}</span>
        </v-btn>
      </div>
    </div>
    <v-overlay xabsolute z-index="10" :value="loading">
      <v-progress-circular color="white" indeterminate size="64">
      </v-progress-circular>
    </v-overlay>
  </div>
</template>

<script>
import ProductAddEdit from "@/components/Products/ProductAddEdit";

export default {
  components: {
    ProductAddEdit,
  },
  data() {
    return {
      loading: false,
      finished: false,
      mode: "",
      product: {
        available: false,
      },
    };
  },
  computed: {
    isRtl() {
      return [
        "ar",
        "he",
        "fa",
        "ur",
        "yi",
        "sy",
        "ku",
        "az",
        "ps",
        "sd",
      ].includes(this.$i18n.locale);
    },
    user() {
      return this.$store.state.auth.user;
    },
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
          text: this.$t("sidebar.add-product"),
          to: "@PV/products/new",
          disabled: true,
        },
      ];
    },
  },
  async mounted() {
    // $nuxt?.$pluginsBus?.$emit("module_products_add_ready", this);
    this.asyncData();
  },
  watch: {},
  methods: {
    async asyncData() {
      var available = true;
      if (this.$store.state.auth.user.role.key == "vendor") {
        available = false;
      }

      this.loading = false,
      console.log("loading ", this.loading);

      this.finished = false,
      this.mode = "",
      this.product = {
        available,
      };
    },
    async saveProduct() {
      if (!this.$refs.addForm.validate()) {
        this.$toast.warning(
          this.$t("notifications.some-fields-are-not-complete")
        );
        return;
      }
      this.loading = true;
      console.log("start loading true", this.loading);

      try {
        await this.$store.dispatch("products/save_product", this.product);
        this.$toast.success(this.$t("notifications.product-is-saved"));
        this.finished = true;
        this.$router.push("@PV/products");
      } catch (error) {
        this.$toast.error(this.$t("notifications.product-is-not-saved"));
      }

      this.loading = false;
      console.log("end loading true", this.loading);
    },
    async beforeRouteLeave(to, from, next) {
      if (this.finished || this.mode == "") {
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