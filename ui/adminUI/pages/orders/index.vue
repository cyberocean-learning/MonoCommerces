<template>
  <div>
    <CLoader
      cpn="ConfirmDialog"
      ref="cancelDialog"
      buttonsColor="error"
      titleColor="var(--v-error-base)"
      titleDark="true"
      shaped
    >
    </CLoader>
    <CLoader
      cpn="Breadcrumb"
      :title="$t('sidebar.orders')"
      :items="breadcrumb"
      class="mb-7 mt-3"
    >
      <template v-slot:homeIcon>
        <img src="/images/store.png" style="width: 17px; margin-bottom: -1px" />
      </template>
      <template v-slot:titleIcon>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          style="
            filter: grayscale(0.9);
            margin-bottom: -10px;
            margin-right: 5px;
          "
          class="menu-item-img"
          width="40"
          height="40"
          xfill="#505050"
          fill="var(--v-primary-base)"
        >
          <use
            xlink:href="/images/shopping-cart.svg#SVG_ID"
            width="40"
            height="40"
          />
        </svg>
      </template>
    </CLoader>
    <CLoader
      cpn="Browse"
      ref="crud"
      shaped
      :loading="loading"
      :structure="structure"
      :items="orders"
      @rowClick="viewOrder"
      @newClick="newOrder"
      rowClickable
      :additionalHeaderSize="300"
      XXtitle="$t('orders.browse-orders')"
      :newButtonCaption="$t('orders.new-order')"
      :hideNewBtn="orders_hide_new_order"
    >
      <template v-slot:item.customer="{ item }">
        <div style="display: flex; align-items: center">
          <img
            :src="
              item.customer.image && item.customer.image.path
                ? item.customer.image.path
                : '/images/user_placeholder.png'
            "
            class="order-user-thumbnail"
          />
          <div style="margin-left: 12px">
            <div>
              <b>{{ item.customer.first_name }}</b>
            </div>
            <div>{{ item.customer.last_name }}</div>
            <div v-if="item.customer.phone">
              <v-icon>mdi-phone</v-icon> {{ item.customer.phone }}
            </div>
            <div v-else><v-icon>mdi-phone-off</v-icon></div>
          </div>
        </div>
      </template>
      <template v-slot:headBeforeSpacer>
        <div class="ml-2 mb-1" style="display: flex">
          <span class="filter-entry-container">
            <span class="filter-entry-title">
              {{ $t("payment") }}
              <v-icon>mdi-chevron-double-right</v-icon>
            </span>
            <v-select
              v-model="paymentFilter"
              :items="paymentFilterItems"
              return-object
              single-line
              dense
            ></v-select>
          </span>
          <span class="filter-entry-container">
            <span class="filter-entry-title">
              {{ $t("orders.state") }}
              <v-icon>mdi-chevron-double-right</v-icon>
            </span>
            <v-select
              v-model="stateFilter"
              :items="stateFilterItems"
              return-object
              single-line
              dense
            ></v-select>
          </span>
        </div>
      </template>
      <template v-slot:item.items="{ item }">
        <div style="white-space: nowrap">
          <div>
            {{ $t("orders.articles-num", { quantity: item.totalQuantity }) }}
          </div>
        </div>
      </template>
      <template v-slot:item.payment="{ item }">
        <div style="">
          <span
            v-if="item.payment.paid"
            class="payment-status payment-status-paid"
          >
            <v-icon>mdi-checkbox-marked-circle-outline</v-icon
            >{{ $t("orders.paid") }}</span
          >
          <span
            v-else-if="!item.payment.paid && item.payment.pending"
            class="payment-status payment-status-pending"
          >
            <v-icon>mdi-progress-clock</v-icon
            >{{ $t("orders.payment-pending") }}</span
          >
          <span v-else class="payment-status">
            <v-icon>mdi-progress-close</v-icon>{{ $t("orders.not-paid") }}</span
          >
        </div>
      </template>
      <template v-slot:item.state="{ item }">
        <!-- DRAFT -->
        <span v-if="item.draft" class="draft-order-tag order-tag">
          <!-- <v-icon>mdi-cart</v-icon> -->
          {{ $t("orders.tags.draft-order") }}
        </span>
        <!-- NEW -->
        <span
          v-else-if="item.state.type == 'NEW'"
          class="new-order-tag order-tag"
        >
          <v-icon>mdi-cart</v-icon>
          {{ $t("orders.tags.new-order") }}
        </span>
        <!-- PREPARATION -->
        <span
          v-else-if="item.state.type == 'PREPARATION'"
          class="preparation-order-tag order-tag"
        >
          <v-icon>mdi-sync-circle</v-icon>
          {{ $t("orders.tags.in-preparation") }}
        </span>
        <!-- IN_TRANSIT -->
        <span
          v-else-if="item.state.type == 'IN_TRANSIT'"
          class="in_transit-order-tag order-tag"
        >
          <v-icon>mdi-truck-delivery</v-icon>
          {{ $t("orders.tags.in-transit") }}
        </span>
        <!-- DELIVERED -->
        <span
          v-else-if="item.state.type == 'DELIVERED'"
          class="delivered-order-tag order-tag"
        >
          <v-icon>mdi-check-circle</v-icon>
          {{ $t("orders.tags.delivered") }}
        </span>
        <!-- CANCELED -->
        <span
          v-else-if="item.state.type == 'CANCELED'"
          class="canceled-order-tag order-tag"
        >
          <v-icon>mdi-cancel</v-icon>
          {{ $t("orders.tags.canceled") }}
        </span>
      </template>
    </CLoader>
    <v-bottom-sheet v-model="bottomSheet">
      <v-sheet class="" height="400px" style="background-color: transparent">
        <!-- <v-btn
          class="mt-6"
          text
          color="red"
          @click="sheet = !sheet"
        >
          close
        </v-btn> -->
        <div
          v-if="bottomSheet"
          class="row ma-0"
          style="
            overflow-y: auto;
            height: 400px;
            border-top-left-radius: 50px;
            background-color: white;
          "
        >
          <div
            class="col-md-3 pa-0"
            style="
              display: flex;
              align-items: center;
              flex-direction: column;
              height: 400px;
              justify-content: flex-start;
            "
          >
            <div
              style="
                display: flex;
                align-items: center;
                width: 100%;
                padding: 8px;
                background-color: #d0d0d0;
              "
            >
              <img
                :src="
                  selectedOrder.customer.image &&
                  selectedOrder.customer.image.path
                    ? selectedOrder.customer.image.path
                    : '/images/user_placeholder.png'
                "
                class="order-user-thumbnail"
                style="width: 100px; height: 100px"
              />
              <div style="margin-left: 10px">
                <div style="font-size: 20px; margin-top: 7px">
                  <b>{{ selectedOrder.customer.first_name }}</b>
                </div>
                <div style="font-size: 20px">
                  {{ selectedOrder.customer.last_name }}
                </div>
              </div>
            </div>
            <div
              v-if="selectedOrder.shipping.method"
              style="
                background-color: var(--v-primary-base);
                margin-bottom: 10px;
                font-weight: bold;
                color: white;
                width: 100%;
                text-align: center;
                padding: 5px;
              "
            >
              <v-icon size="27" color="white">mdi-truck-delivery</v-icon>
              {{ $t("shipping-methods." + selectedOrder.shipping.method.key) }}
            </div>
            <div v-if="selectedOrder.customer.email">
              <v-icon>mdi-email</v-icon> {{ selectedOrder.customer.email }}
            </div>
            <div v-else><v-icon>mdi-email-off</v-icon></div>

            <div
              v-if="
                selectedOrder.shipping.address &&
                selectedOrder.shipping.address.phoneNumber
              "
            >
              <v-icon>mdi-phone</v-icon>
              {{ selectedOrder.shipping.address.phoneNumber }}
            </div>
            <div v-else-if="selectedOrder.customer.phone">
              <v-icon>{{ selectedOrder.customer.phone }}</v-icon>
            </div>
            <div v-else><v-icon>mdi-phone-off</v-icon></div>

            <div
              v-if="selectedOrder.shipping.address"
              style="text-align: center"
            >
              <v-icon>mdi-map-marker</v-icon>
              {{ selectedOrder.shipping.address.address }}
              <div>{{ selectedOrder.shipping.address.city }}</div>
              <b>{{ selectedOrder.shipping.address.zipCode }}</b>
            </div>
            <div
              v-else-if="selectedOrder.customer.default_address"
              style="text-align: center"
            >
              <v-icon>mdi-map-marker</v-icon>
              {{ selectedOrder.customer.default_address.address }}
              <div>{{ selectedOrder.customer.default_address.city }}</div>
              <b>{{ selectedOrder.customer.default_address.zipCode }}</b>
            </div>
            <div v-else>
              <v-icon>mdi-circle-off-outline</v-icon>
              {{ $t("customers.no-address") }}
            </div>
          </div>
          <div class="col-md-7 pa-0" style="border-left: 2px solid #efefef">
            <div
              style="
                text-align: center;
                background-color: #afafaf;
                color: white;
                font-weight: bold;
                font-size: 18px;
                height: 25px;
              "
            >
              {{ $t("orders.products-list") }}
            </div>
            <div class="row ma-0">
              <div class="col-md-5 pa-0 products-list">
                <div
                  v-for="(item, index) in selectedOrder.items"
                  class="product-item"
                  :key="index"
                  @click="selectItem(item, index)"
                >
                  <span class="quantity">{{ item.quantity }}x</span>
                  <div
                    class="product-box"
                    :style="
                      index == SO_SelIndex ? 'background-color: #d3d3d3;' : ''
                    "
                  >
                    <img :src="item.product.image.path" />
                    <span class="product-title">{{ item.product.title }}</span>
                  </div>
                </div>
              </div>
              <div v-if="SO_SelItem" class="col-md-7 pa-0 item-viewer">
                <div class="product-box">
                  <img
                    class="product-img"
                    :src="SO_SelItem.product.image.path"
                  />
                  <span class="product-title">
                    <span>{{ SO_SelItem.product.title }}</span>
                    <div
                      v-if="SO_SelItem.type == 'VARIANTS_PRODUCT'"
                      style="display: flex; flex-flow: wrap"
                    >
                      <span
                        v-for="op in SO_SelItem.product.optionsData"
                        style="
                          border: 1px dashed #424242;
                          padding: 0px 4px;
                          border-radius: 4px;
                          margin-top: 2px;
                          margin-right: 2px;
                          display: inline-block;
                          font-size: 15px;
                          background-color: white;
                        "
                      >
                        <b>{{ op.name }}:</b>
                        {{
                          SO_SelItem.data.selectedVariantOptions[op.id] ||
                          "ERROR"
                        }}
                      </span>
                    </div>
                  </span>
                </div>
                <div
                  style="
                    overflow-y: auto;
                    width: 100%;
                    text-align: left;
                    padding: 7px;
                  "
                >
                  <!-- <div class=""><b>Quantity: </b>{{SO_SelItem.quantity}}</div>
									<div class=""><b>Price: </b>{{SO_SelItem.product.price}}</div> -->
                  <table class="table" width="100%">
                    <tbody>
                      <tr>
                        <th>{{ $t("product.quantity") }}</th>
                        <td>{{ SO_SelItem.quantity }}</td>
                      </tr>
                      <tr>
                        <th>{{ $t("product.price") }}</th>
                        <td>{{ SO_SelItem.product.price }}</td>
                      </tr>
                      <tr v-if="SO_SelItem.note">
                        <td colspan="2">
                          <hr class="mt-2 mb-2" />
                        </td>
                      </tr>
                      <tr v-if="SO_SelItem.note">
                        <th>{{ $t("product.note") }}</th>
                        <td v-if="SO_SelItem.noteMultiOptionsEnabled">
                          <temaplate
                            v-for="(bool, index) in SO_SelItem.note"
                            :key="index"
                          >
                            <div
                              v-if="bool"
                              style="display: flex; margin-bottom: 5px"
                            >
                              <v-icon left color="success"
                                >mdi-check-circle</v-icon
                              >
                              <b style="color: var(--v-success-base)">{{
                                index
                              }}</b>
                            </div>
                            <div
                              v-else
                              style="display: flex; margin-bottom: 5px"
                            >
                              <v-icon left color="gray"
                                >mdi-close-circle</v-icon
                              >
                              <span>{{ index }}</span>
                            </div>
                          </temaplate>
                        </td>
                        <td v-else>{{ SO_SelItem.note }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-2 pa-0" style="position: relative">
            <template>
              <div
                v-if="orders[selectedOrderIndex].state.type == 'NEW'"
                style="
                  background-color: var(--v-success-base);
                  color: white;
                  font-size: 20px;
                  font-weight: bold;
                  text-align: center;
                  min-height: 50px;
                  padding-top: 9px;
                "
              >
                <v-icon size="27" color="white">mdi-cart</v-icon>
                {{ $t("orders.tags.new-order") }}
              </div>
              <div
                v-if="orders[selectedOrderIndex].state.type == 'PREPARATION'"
                style="
                  background-color: #e6d116;
                  color: white;
                  font-size: 20px;
                  font-weight: bold;
                  text-align: center;
                  min-height: 50px;
                  padding-top: 9px;
                "
              >
                <v-icon size="27" color="white">mdi-sync-circle</v-icon>
                {{ $t("orders.tags.in-preparation") }}
              </div>
              <div
                v-if="orders[selectedOrderIndex].state.type == 'IN_TRANSIT'"
                style="
                  background-color: var(--v-warning-base);
                  color: white;
                  font-size: 20px;
                  font-weight: bold;
                  text-align: center;
                  min-height: 50px;
                  padding-top: 9px;
                "
              >
                <v-icon size="27" color="white">mdi-truck-delivery</v-icon>
                {{ $t("orders.tags.in-transit") }}
              </div>
              <div
                v-if="orders[selectedOrderIndex].state.type == 'DELIVERED'"
                style="
                  background-color: #00ad00;
                  color: white;
                  font-size: 20px;
                  font-weight: bold;
                  text-align: center;
                  min-height: 50px;
                  padding-top: 9px;
                "
              >
                <v-icon size="27" color="white">mdi-check-circle</v-icon>
                {{ $t("orders.tags.delivered") }}
              </div>
              <div
                v-if="orders[selectedOrderIndex].state.type == 'CANCELED'"
                style="
                  background-color: var(--v-error-base);
                  color: white;
                  font-size: 20px;
                  font-weight: bold;
                  text-align: center;
                  min-height: 50px;
                  padding-top: 9px;
                "
              >
                <v-icon size="27" color="white">mdi-cancel</v-icon>
                {{ $t("orders.tags.canceled") }}
              </div>
            </template>
            <div class="states-btns">
              <div v-if="statesLoading" class="loader">
                <v-progress-circular
                  width="3"
                  size="80"
                  indeterminate
                  color="white"
                />
              </div>
              <!-- NEW -->
              <button
                @click="changeOrderState(selectedOrder, 'NEW')"
                class="state-btn new-order-btn"
                v-show="orders[selectedOrderIndex].state.type == 'PREPARATION'"
              >
                <v-icon>mdi-cart</v-icon>
                <v-spacer />
                {{ $t("orders.tags.new-order") }}
                <v-spacer />
              </button>
              <!-- PREPARATION -->
              <button
                @click="changeOrderState(selectedOrder, 'PREPARATION')"
                class="state-btn preparation-order-btn"
                v-show="orders[selectedOrderIndex].state.type == 'NEW'"
              >
                <v-icon>mdi-sync-circle</v-icon>
                <v-spacer />
                {{ $t("orders.tags.in-preparation") }}
                <v-spacer />
              </button>
              <!-- IN_TRANSIT -->
              <button
                @click="changeOrderState(selectedOrder, 'IN_TRANSIT')"
                class="state-btn in_transit-order-btn"
                v-show="orders[selectedOrderIndex].state.type == 'PREPARATION'"
              >
                <v-icon>mdi-truck-delivery</v-icon>
                <v-spacer />
                {{ $t("orders.tags.in-transit") }}
                <v-spacer />
              </button>
              <!-- DELIVERED -->
              <button
                @click="changeOrderState(selectedOrder, 'DELIVERED')"
                class="state-btn delivered-order-btn"
                v-show="orders[selectedOrderIndex].state.type == 'IN_TRANSIT'"
              >
                <v-icon>mdi-check-circle</v-icon>
                <v-spacer />
                {{ $t("orders.tags.delivered") }}
                <v-spacer />
              </button>
              <!-- CANCELED -->
              <button
                @click="cancelOrder"
                class="state-btn canceled-order-btn"
                v-show="
                  !'CANCELED DELIVERED'.includes(
                    orders[selectedOrderIndex].state.type
                  )
                "
              >
                <v-icon>mdi-cancel</v-icon>
                <v-spacer />
                {{ $t("orders.tags.canceled") }}
                <v-spacer />
              </button>
            </div>
          </div>
        </div>
      </v-sheet>
    </v-bottom-sheet>
  </div>
</template>

<script>

export default {
  data() {
    return {
      selectedOrder: null,
      selectedOrderIndex: -1,
      SO_SelItem: null,
      SO_SelIndex: -1,
      statesLoading: false,
      bottomSheet: false,
      loading: false,
      stateFilter: { value: "all" },
      paymentFilter: { value: "all" },
      paymentFilterItems: [
        { text: this.$t("common.all"), value: "all" },
        { text: this.$t("orders.paid"), value: "paid" },
        { text: this.$t("orders.payment-pending"), value: "pending" },
        { text: this.$t("orders.not-paid"), value: "not-paid" },
      ],
      stateFilterItems: [
        { text: this.$t("common.all"), value: "all" },
        { text: this.$t("orders.tags.new-order"), value: "NEW" },
        { text: this.$t("orders.tags.in-preparation"), value: "PREPARATION" },
        { text: this.$t("orders.tags.in-transit"), value: "IN_TRANSIT" },
        { text: this.$t("orders.tags.delivered"), value: "DELIVERED" },
        { text: this.$t("orders.tags.canceled"), value: "CANCELED" },
      ],
    };
  },
  watch: {},
  computed: {
    settings() {
      return this.shop.settings;
    },
    orders_hide_new_order() {
      if (this.settings.orders_hide_new_order) {
        return this.settings.orders_hide_new_order.value;
      } else {
        return false;
      }
    },
    orders() {
      var orders = this.$store.state.orders.orders;
      if (!this.paymentFilter || this.paymentFilter.value != "all") {
        orders = orders.filter((order) => {
          if (order.payment.paid) {
            return this.paymentFilter.value == "paid";
          } else if (!order.payment.paid && order.payment.pending) {
            return this.paymentFilter.value == "pending";
          } else {
            return this.paymentFilter.value == "not-paid";
          }
        });
      }
      if (!this.stateFilter || this.stateFilter.value != "all") {
        orders = orders.filter((order) => {
          return order.state.type == this.stateFilter.value;
        });
      }
      return orders;
    },
    shop() {
      return this.$store.state.shop;
    },
    getters() {
      return this.$store.getters;
    },
    breadcrumb() {
      return [
        {
          text: this.$t("sidebar.orders"),
          to: "/orders",
          disabled: false,
        },
      ];
    },
    structure() {
      return [
        {
          text: this.$t("orders.customer"),
          value: "customer",
          type: "text",
        },
        {
          text: this.$t("orders.items"),
          value: "items",
          type: "text",
        },
        {
          text: "Payment",
          value: "payment",
          type: "text",
        },
        {
          text: this.$t("orders.state"),
          value: "state",
          type: "text",
        },
        // {
        // 	text: "Created At",
        // 	value: "created_at",
        // 	type: "text",
        // 	readOnly: true,
        // },
        // {
        // 	text: "Actions",
        // 	value: "actions",
        // 	type: "actions",
        // },
      ];
    },
  },
  mounted() {
    // this.loadDatabases();
  },
  methods: {
    // loadDatabases(){
    // 	this.loading = true;
    // 	this.$dataCaller("get", "/api/databases").then((data) => {
    // 	var dbs = [];
    // 	for(var db of data){
    // 		dbs.push({
    // 			name: db,
    // 		});
    // 	}
    // 	this.databases = dbs;
    // 	this.loading = false;
    // });
    // },
    async cancelOrder() {
      if (
        !(await this.$refs.cancelDialog.cp.confirm(
          this.$t("orders.cancel-this-order"),
          ""
        ))
      ) {
        this.loading = false;
        return;
      }
      this.changeOrderState(this.selectedOrder, "CANCELED");
    },
    selectItem(item, index) {
      this.SO_SelItem = item;
      this.SO_SelIndex = index;
    },
    newOrder() {
      this.loading = true;
      // this.$dataCaller("post", "/api/change-order-state", {
      // 	orderId: orderId,
      // 	newState: newState,
      // }).then((_) => {
      // 	this.$toast.success("Order updated");
      // 	this.statesLoading = false;
      // 	// selectedOrder.state.type = newState;
      // }).catch((_) => {
      // 	this.$toast.error("Order not updated");
      // 	this.statesLoading = false;
      // });
      this.$dataCaller("post", "/api/create-draft-order", {
        // oreder: "dsdfsdfsdfsdfsdfsdfsd"
      })
        .then((order) => {
          console.log("order 6+++++++++++++++++++");
          console.log(order);
          this.$toast.success(this.$t("orders.order-created"));
          this.loading = false;
          if (order) this.$router.push("@PV/orders/" + order.id);
          // selectedOrder.state.type = newState;
        })
        .catch((_) => {
          this.$toast.error(this.$t("orders.order-not-created"));
          this.loading = false;
        });

      // this.$dataCaller("post", "/api/change-order-state", {
      // 	orderId: orderId,
      // 	newState: newState,
      // }).then((_) => {
      // 	this.$toast.success("Order updated");
      // 	this.loading = false;
      // }).catch((_) => {
      // 	this.$toast.error("Order not updated");
      // 	this.loading = false;
      // });
    },
    viewOrder(item) {
      if (this.settings.orders_fast_ordering_system.value) {
        this.selectedOrder = item;
        this.selectedOrderIndex = this.orders.findIndex((o) => o.id == item.id);
        this.selectItem(this.selectedOrder.items[0] || null, 0);
        this.bottomSheet = true;
      } else {
        this.$router.push("@PV/orders/" + item.id);
      }
    },
    changeOrderState(selectedOrder, newState) {
      var orderId = selectedOrder.id;
      this.statesLoading = true;
      this.$dataCaller("post", "/api/change-order-state", {
        orderId: orderId,
        newState: newState,
      })
        .then((_) => {
          this.$toast.success(this.$t("orders.order-updated"));
          this.statesLoading = false;
          // selectedOrder.state.type = newState;
        })
        .catch((_) => {
          this.$toast.error(this.$t("orders.order-not-updated"));
          this.statesLoading = false;
        });
    },
    insertRequest(data) {
      // this.$dataCaller("post", "/api/databases", data).then((_) => {
      // 	this.loading = false;
      // 	this.loadDatabases();
      // });
    },
    updateRequest(data) {
      // console.log(data);
    },
    deleteRequest(db) {
      // this.$dataCaller("delete", "/api/databases/"+db.name).then((_) => {
      // 	this.loading = false;
      // 	this.loadDatabases();
      // });
    },
  },
};
</script>


<style scoped>
/*.no-padding is commented out in the original SCSS, so it's omitted here */

.order-user-thumbnail {
  width: 70px;
  height: 70px;
  border: 1px solid #c1c1c1;
  border-radius: 40px;
  object-fit: cover;
  background-color: white;
  padding: 1px;
  margin-top: 5px;
}

.new-order-btn {
  border-right: 4px solid var(--v-success-base);
  border-bottom: 2px solid var(--v-success-base);
  background-color: var(--v-success-base);
}

.in_transit-order-btn {
  border-right: 4px solid var(--v-warning-base);
  border-bottom: 2px solid var(--v-warning-base);
  background-color: var(--v-warning-base);
}

.delivered-order-btn {
  border-right: 4px solid #00ad00;
  border-bottom: 2px solid #00ad00;
  background-color: #00ad00;
}

.canceled-order-btn {
  border-right: 4px solid var(--v-error-base);
  border-bottom: 2px solid var(--v-error-base);
  background-color: var(--v-error-base);
}

.preparation-order-btn {
  border-right: 4px solid #e6d116;
  border-bottom: 2px solid #e6d116;
  background-color: #e6d116;
}

.new-order-tag {
  border-right: 4px solid var(--v-success-base);
  border-bottom: 2px solid var(--v-success-base);
  background-color: var(--v-success-base);
  animation: blink 1s infinite;
}

.draft-order-tag {
  border-right: 4px solid #747474;
  border-bottom: 2px solid #747474;
  background-color: #747474;
}

.preparation-order-tag {
  border-right: 4px solid #e6d116;
  border-bottom: 2px solid #e6d116;
  background-color: #e6d116;
}

.in_transit-order-tag {
  border-right: 4px solid var(--v-warning-base);
  border-bottom: 2px solid var(--v-warning-base);
  background-color: var(--v-warning-base);
}

.delivered-order-tag {
  border-right: 4px solid #00ad00;
  border-bottom: 2px solid #00ad00;
  background-color: #00ad00;
}

.canceled-order-tag {
  border-right: 4px solid var(--v-error-base);
  border-bottom: 2px solid var(--v-error-base);
  background-color: var(--v-error-base);
}

.order-tag {
  width: 100%;
  color: #ffffffc7;
  font-weight: bold;
  font-size: 13px;
  padding: 4px 5px;
  padding-left: 7px;
  border-top-left-radius: 20px;
  border-top-right-radius: 0px;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 7px;
  white-space: nowrap;
}

.order-tag.v-icon {
  color: inherit;
  font-size: 18px;
  margin-top: -3px;
}

.item-viewer {
  height: 375px;
  background-color: #efefef;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.item-viewer.product-box {
  height: 150px;
  width: 100%;
  background-color: #d3d3d3;
  border-bottom: 2px solid #afafaf;
  display: flex;
}

.item-viewer.product-img {
  height: 148px;
  width: 150px;
}

.item-viewer.product-title {
  font-size: 20px;
  font-weight: 500;
  padding: 7px;
}

.states-btns {
  display: flex;
  flex-direction: column;
  padding: 5px 10px;
  overflow-y: auto;
}

.states-btns.loader {
  position: absolute;
  background-color: #00000080;
  top: 0px;
  left: 0px;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  place-content: center;
  z-index: 10;
}

.state-btn {
  display: flex;
  margin-top: 5px;
  color: white;
  font-weight: bold;
  padding: 10px 15px;
  border-top-left-radius: 20px;
  border-top-right-radius: 0px;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 7px;
}

.state-btn.v-icon {
  color: inherit;
}

.state-btn:hover {
  opacity: 0.8;
}

.products-list {
  overflow-y: auto;
  max-height: 375px;
}

.products-list.product-item {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  margin: 5px 0px;
  border-bottom: 1px solid #e2e2e2;
  padding-bottom: 5px;
  padding-right: 5px;
}

.products-list.product-item img {
  width: 70px;
  height: 70px;
  border-radius: 5px;
  margin: 5px;
}

.products-list.product-item.quantity {
  font-size: 23px;
  font-weight: bold;
  padding: 0px 5px;
  border-right: 1px solid #e2e2e2;
  height: 100px;
  display: flex;
  align-items: center;
  width: 70px;
  justify-content: flex-end;
}

.products-list.product-item.product-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  background-color: #efefef;
  cursor: pointer;
}

.products-list.product-item.product-box:hover {
  background-color: #e0e0e0;
}

.products-list.product-item.product-title {
  flex-grow: 1;
  font-size: 18px;
  margin-left: 5px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  max-width: 165px;
}

.products-list.product-item.price {
  font-size: 17px;
  margin-right: 5px;
  padding-top: 3px;
  padding-left: 5px;
  height: 100px;
  display: flex;
  align-items: center;
}

.products-list.product-item.price-total {
  font-weight: bold;
  font-size: 20px;
}

.payment-status {
  margin-left: 10px;
  font-size: 15px;
  color: gray;
  display: flex;
  align-items: center;
}

.payment-status i {
  margin-right: 5px;
}

.payment-status-paid {
  color: var(--v-success-base);
  font-weight: bold;
}

.payment-status-paid.v-icon {
  color: var(--v-success-base);
}

.payment-status-pending {
  color: var(--v-warning-base);
  font-weight: bold;
}

.payment-status-pending.v-icon {
  color: var(--v-warning-base);
}

.filter-entry-container {
  display: flex;
  border-left: 2px solid rgb(119, 119, 127);
  border-bottom: 1px dashed rgb(148 148 148);
  border-bottom-left-radius: 5px;
  border-top-left-radius: 4px;
  margin-left: 10px;
  padding-left: 5px;
  height: 33px;
}

.filter-entry-container.filter-entry-title {
  font-size: 17px;
  white-space: nowrap;
  align-self: center;
  font-weight: bold;
  color: #77777f;
  margin-right: 4px;
}

.filter-entry-container.v-select {
  width: min-content;
  min-width: 125px;
}

/* Keyframes for blink animation */
@keyframes blink {
  0% {
    background-color: var(--v-success-base);
    color: white;
  }
  50% {
    background-color: #99dc9b;
    color: var(--v-success-base);
  }
  100% {
    background-color: var(--v-success-base);
    color: white;
  }
}
</style>