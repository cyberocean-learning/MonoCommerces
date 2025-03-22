<template>
  <div v-if="order" class="order-main-layout ">
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
      cpn="ConfirmDialog"
      ref="invoicePrice"
      buttonsColor="primary"
      titleColor="var(--v-primary-base)"
      titleDark="true"
      shaped
    >
      <v-text-field
        :label="$t('orders.invoices-amount')"
        v-model="invoiceAmount"
      />
    </CLoader>
    <CLoader
      cpn="DataPicker"
      ref="variantsPicker"
      XlistUrl="/api/variants"
      apiKey="variants"
      isServerSide
      :structure="variantsStructure"
      @itemSelect="dataPicker_addItem"
    />
    <div class="order-header">
      <nuxt-link to="/orders" tag="div" class="return-breadcrumb">
        <v-icon>mdi-chevron-left</v-icon>
        {{ $t("sidebar.orders") }}
      </nuxt-link>
      <div class="order-header-content">
        <h1 class="mr-2">#{{ order.number }}</h1>
        <span>{{ order.formatted_created_at }}</span>
        <template>
          <span
            v-if="order.payment.paid"
            class="payment-status payment-status-paid"
          >
            <v-icon>mdi-checkbox-marked-circle-outline</v-icon
            >{{ $t("orders.paid") }}</span
          >
          <span
            v-else-if="!order.payment.paid && order.payment.pending"
            class="payment-status payment-status-pending"
          >
            <v-icon>mdi-progress-clock</v-icon
            >{{ $t("orders.payment-pending") }}</span
          >
          <span v-else class="payment-status">
            <v-icon>mdi-progress-close</v-icon>{{ $t("orders.not-paid") }}</span
          >
        </template>
        <v-spacer></v-spacer>
        <template>
          <div v-if="order.draft" class="state-tag draft-order-btn">
            {{ $t("orders.tags.draft-order") }}
          </div>
          <div
            v-else-if="order.state.type == 'NEW'"
            class="state-tag new-order-btn"
          >
            <v-icon color="white">mdi-cart</v-icon>
            {{ $t("orders.tags.new-order") }}
          </div>
          <div
            v-else-if="order.state.type == 'PREPARATION'"
            class="state-tag preparation-order-btn"
          >
            <v-icon color="white">mdi-sync-circle</v-icon>
            {{ $t("orders.tags.in-preparation") }}
          </div>
          <div
            v-else-if="order.state.type == 'IN_TRANSIT'"
            class="state-tag in_transit-order-btn"
          >
            <v-icon color="white">mdi-truck-delivery</v-icon>
            {{ $t("orders.tags.in-transit") }}
          </div>
          <div
            v-else-if="order.state.type == 'DELIVERED'"
            class="state-tag delivered-order-btn"
          >
            <v-icon color="white">mdi-check-circle</v-icon>
            {{ $t("orders.tags.delivered") }}
          </div>
          <div
            v-else-if="order.state.type == 'CANCELED'"
            class="state-tag canceled-order-btn"
          >
            <v-icon color="white">mdi-cancel</v-icon>
            {{ $t("orders.tags.canceled") }}
          </div>
        </template>
      </div>
      <div class="order-header-buttons">
        <!-- <v-btn
          v-if="order.state.type == 'DELIVERED'"
          @click="getInvoice"
          outlined
          small
          color="#5c5c5c"
          style="text-transform: none"
        >
          <v-icon left>mdi-printer</v-icon>
          {{ $t("orders.print-invoice") }}
        </v-btn> -->
        <!-- NEW -->
        <v-btn
          @click="changeOrderState('NEW')"
          small
          color="var(--v-success-base)"
          outlined
          class="state-btn"
          v-show="
            (order.draft && !orderIsEmpty) || order.state.type == 'PREPARATION'
          "
        >
          <v-icon>mdi-cart</v-icon>
          <v-spacer />
          {{ $t("orders.tags.new-order") }}
          <v-spacer />
        </v-btn>
        <!-- PREPARATION -->
        <v-btn
          @click="changeOrderState('PREPARATION')"
          small
          color="#b9a600"
          outlined
          class="state-btn"
          v-show="!order.draft && order.state.type == 'NEW'"
        >
          <v-icon>mdi-sync-circle</v-icon>
          <v-spacer />
          {{ $t("orders.tags.in-preparation") }}
          <v-spacer />
        </v-btn>
        <!-- IN_TRANSIT -->
        <v-btn
          @click="changeOrderState('IN_TRANSIT')"
          small
          color="var(--v-warning-base)"
          outlined
          class="state-btn"
          v-show="!order.draft && order.state.type == 'PREPARATION'"
        >
          <v-icon>mdi-truck-delivery</v-icon>
          <v-spacer />
          {{ $t("orders.tags.in-transit") }}
          <v-spacer />
        </v-btn>
        <!-- DELIVERED -->
        <v-btn
          @click="changeOrderState('DELIVERED')"
          small
          color="#00ad00"
          outlined
          class="state-btn"
          v-show="
            (order.draft && !orderIsEmpty) || order.state.type == 'IN_TRANSIT'
          "
        >
          <v-icon>mdi-check-circle</v-icon>
          <v-spacer />
          {{ $t("orders.tags.delivered") }}
          <v-spacer />
        </v-btn>
        <!-- CANCELED -->
        <v-btn
          @click="cancelOrder"
          small
          color="var(--v-error-base)"
          outlined
          class="state-btn"
          v-show="!order.draft && !'CANCELED'.includes(order.state.type)"
        >
          <v-icon>mdi-cancel</v-icon>
          <v-spacer />
          {{ $t("orders.tags.canceled") }}
          <v-spacer />
        </v-btn>

        <!-- <v-dialog v-model="dialog" persistent max-width="1000">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-bind="attrs"
              v-on="on"
              small
              color="var(--v-primary-base)"
              outlined
              class="state-btn"
              xxv-show="order.state.type == 'PREPARATION'"
            >
              <v-icon>mdi-cart-plus</v-icon>
              <v-spacer />
              ajouter des produits
              <v-spacer />
            </v-btn>
          </template>
          <v-card width="1000">
            <v-card-title class="text-h5"> Ajouter des produits </v-card-title>
            <v-card-text>
              <v-simple-table fixed-header width="600px" height="300px">
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-left">image</th>
                      <th class="text-left">Nom de produit</th>
                      <th class="text-left">sku</th>
                      <th class="text-left">code a bare</th>
                      <th class="text-left">Qte</th>
                      <th class="text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="variant in variants" :key="variant.id">
                      <td>
                        <v-avatar>
                          <img
                            :src="variant.image.path"
                        
                          />
                        </v-avatar>
                      </td>
                      <td>{{ variant.title }}</td>
                      <td>{{ variant.sku }}</td>
                      <td>{{ variant.barcode }}</td>
                      <td>
                        <v-text-field
                          name="Qte"
                          label="Qte"
                          value="1"
                        ></v-text-field>
                      </td>
					  <td>
						  <v-btn flat icon color="red" >
							  <v-icon>mdi-close-circle</v-icon>
						  </v-btn>
					  </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="var(--v-danger-base)" text @click="dialog = false">
                annuler
              </v-btn>
              <v-btn color="var(--v-primary-base)" text @click="dialog = false">
                Ajouter
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog> -->
      </div>
    </div>
    <v-row>
      <div class="main-section">
        <v-card>
          <h4>{{ $t("orders.items") }}</h4>
          <ItemsList
            :items="order.items"
            @deleteItem="cartDeleteItem"
            @addItem="cartAddItem"
            @updateQuantity="cartUpdateQuantity"
            :editable="order.draft"
          />
          <SummaryTotal :summary="order" />
        </v-card>

        <v-card>
          <h4>{{ $t("products.shipping") }}</h4>
          <v-simple-table
            dense
            style="xmargin: 10px; border: 1px solid #e0e0e0"
          >
            <tbody>
              <tr v-if="order.shipping.method" style="text-align: left">
                <th>{{ $t("shipping-method") }}</th>
                <td>
                  {{ $t("shipping-methods." + order.shipping.method.key) }}
                </td>
              </tr>
              <tr v-else style="text-align: left">
                <th>{{ $t("shipping-method") }}</th>
                <td><v-icon>mdi-circle-off-outline</v-icon></td>
              </tr>

              <tr
                v-if="
                  order.shipping.address && order.shipping.address.phoneNumber
                "
                style="text-align: left"
              >
                <th>{{ $t("phone-number") }}</th>
                <td>{{ order.shipping.address.phoneNumber }}</td>
              </tr>
              <tr v-else-if="order.customer.phone" style="text-align: left">
                <th>{{ $t("phone-number") }}</th>
                <td>{{ order.customer.phone }}</td>
              </tr>
              <tr v-else style="text-align: left">
                <th>{{ $t("phone-number") }}</th>
                <td><v-icon>mdi-phone-off</v-icon></td>
              </tr>

              <tr v-if="order.shipping.address" style="text-align: left">
                <th>{{ $t("address") }}</th>
                <td>
                  {{ order.shipping.address.address }}
                  <div>{{ order.shipping.address.city }}</div>
                  <b>{{ order.shipping.address.zipCode }}</b>
                </td>
              </tr>
              <tr
                v-else-if="order.customer.default_address"
                style="text-align: left"
              >
                <th>{{ $t("address") }}</th>
                <td>
                  {{ order.customer.default_address.address }}
                  <div>{{ order.customer.default_address.city }}</div>
                  <b>{{ order.customer.default_address.zipCode }}</b>
                </td>
              </tr>
              <tr v-else style="text-align: left">
                <th>{{ $t("address") }}</th>
                <td><v-icon>mdi-map-marker-off</v-icon></td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-card>

        <!-- <span v-if="order.payment.paid" class="payment-status payment-status-paid">  <v-icon>mdi-checkbox-marked-circle-outline</v-icon> paid</span>
				<span v-else-if="!order.payment.paid && order.payment.pending" class="payment-status payment-status-pending">  <v-icon>mdi-progress-clock</v-icon> Payment pending</span>
				<span v-else class="payment-status">  <v-icon>mdi-progress-close</v-icon> Not paid</span> -->
      </div>
      <div class="side-section">
        <v-card>
          <h4>
            {{
              $t("orders.notes", {
                n: notes.length + (!!order.customNote ? 1 : 0),
              })
            }}
          </h4>
          <v-btn
            v-if="!editNote && order.draft"
            @click="editNote = true"
            outlined
            small
            style="
              text-transform: none;
              position: absolute;
              right: 15px;
              top: 15px;
            "
          >
            <v-icon left>mdi-pen</v-icon> {{ $t("common.edit") }}
          </v-btn>
          <div v-else-if="order.draft">
            <v-textarea v-model="customNote"></v-textarea>
            <div class="d-flex">
              <v-spacer></v-spacer>
              <v-btn
                @click="savecustomNote"
                color="primary"
                style="text-transform: none"
                >{{ $t("common.save") }}</v-btn
              >
            </div>
          </div>
          <div v-if="notes.length == 0" style="color: gray">
            <div v-if="!order.customNote" style="color: gray">
              {{ $t("orders.no-notes-from-customer") }}
            </div>
          </div>
          <div v-else>
            <div v-for="note in notes" :key="note.counter">
              <div style="font-size: 12px; font-weight: bold">
                {{ note.name }}
              </div>
              <div
                style="
                  margin-left: 5px;
                  padding-left: 5px;
                  border-left: 1px solid gray;
                "
              >
                {{ note.content }}
              </div>
            </div>
          </div>
          <div v-if="order.customNote" v-html="parsed_customNote"></div>
        </v-card>
        <v-card>
          <h4>{{ $t("orders.customer") }}</h4>
          <v-btn
            v-if="!editCustomer && order.draft"
            @click="enableEditCustomer"
            outlined
            small
            style="
              text-transform: none;
              position: absolute;
              right: 15px;
              top: 15px;
            "
          >
            <v-icon left>mdi-pen</v-icon> {{ $t("common.edit") }}
          </v-btn>
          <div v-else-if="order.draft">
            <v-autocomplete
              :value="newOrderCustomerId"
              @input="setNewOrderCustomer"
              :items="items_users"
            ></v-autocomplete>
          </div>
          <div>
            <div
              style="
                display: flex;
                align-items: center;
                width: 100%;
                padding: 8px;
                xbackground-color: #d0d0d0;
              "
            >
              <img
                :src="
                  order.customer.image && order.customer.image.path
                    ? order.customer.image.path
                    : '/images/user_placeholder.png'
                "
                class="order-user-thumbnail"
                style="width: 65px; height: 65px; box-shadow: 0px 0px 3px gray"
              />
              <div style="margin-left: 10px">
                <div style="font-size: 16px; margin-top: 7px">
                  <b>{{ order.customer.first_name }}</b>
                </div>
                <div style="font-size: 16px">
                  {{ order.customer.last_name }}
                </div>
              </div>
            </div>
            <div
              v-if="order.shipping.method"
              style="
                background-color: #e1e2e3;
                margin-bottom: 10px;
                font-weight: 500;
                color: #565656;
                width: 100%;
                text-align: center;
                padding: 5px;
              "
            >
              <v-icon size="23" xcolor="white">mdi-truck-delivery</v-icon>
              {{ $t("shipping-methods." + order.shipping.method.key) }}
            </div>
            <div v-if="order.customer.email">
              <v-icon>mdi-email</v-icon> {{ order.customer.email }}
            </div>
            <div v-else><v-icon>mdi-email-off</v-icon></div>

            <div
              v-if="
                order.shipping.address && order.shipping.address.phoneNumber
              "
            >
              <v-icon>mdi-phone</v-icon>
              {{ order.shipping.address.phoneNumber }}
            </div>
            <div v-else-if="order.customer.phone">
              <v-icon>{{ order.customer.phone }}</v-icon>
            </div>
            <div v-else><v-icon>mdi-phone-off</v-icon></div>

            <div v-if="order.shipping.address" xstyle="text-align: center;">
              <v-icon style="position: absolute">mdi-map-marker</v-icon>
              <div style="padding-left: 28px">
                {{ order.shipping.address.address }}
              </div>
              <div style="padding-left: 28px">
                {{ order.shipping.address.city }}
              </div>
              <b style="padding-left: 28px">{{
                order.shipping.address.zipCode
              }}</b>
            </div>
            <div
              v-else-if="order.customer.default_address"
              xstyle="text-align: center;"
            >
              <v-icon style="position: absolute">mdi-map-marker</v-icon>
              <div style="padding-left: 28px">
                {{ order.customer.default_address.address }}
              </div>
              <div style="padding-left: 28px">
                {{ order.customer.default_address.city }}
              </div>
              <b style="padding-left: 28px">{{
                order.customer.default_address.zipCode
              }}</b>
            </div>
            <div v-else>
              <v-icon>mdi-circle-off-outline</v-icon>
              {{ $t("customers.no-address") }}
            </div>
          </div>
        </v-card>

        <v-card>
          <h4 class="d-flex">
            <span>
              {{ $t("payment") }}
            </span>
            <v-spacer></v-spacer>
            <template>
              <span
                v-if="order.payment.paid"
                class="payment-status payment-status-paid"
              >
                <v-icon>mdi-checkbox-marked-circle-outline</v-icon
                >{{ $t("orders.paid") }}</span
              >
              <span
                v-else-if="!order.payment.paid && order.payment.pending"
                class="payment-status payment-status-pending"
              >
                <v-icon>mdi-progress-clock</v-icon
                >{{ $t("orders.payment-pending") }}</span
              >
              <span v-else class="payment-status">
                <v-icon>mdi-progress-close</v-icon
                >{{ $t("orders.not-paid") }}</span
              >
            </template>
          </h4>
          <div class="order-bottom-buttons">
            <v-btn
              @click="changeOrderPaymentState('paid')"
              outlined
              block
              class="pl-2 pr-2 mt-2 mb-2 btn-multiline"
              color="#5c5c5c"
              style="text-transform: none"
            >
              <span class="text-wrap">
                <v-icon>mdi-checkbox-marked-circle-outline</v-icon>
                {{ $t("orders.mark-as-paid") }}
              </span>
            </v-btn>
            <v-btn
              @click="changeOrderPaymentState('pending')"
              outlined
              block
              class="pl-2 pr-2 mt-2 mb-2 btn-multiline"
              color="#5c5c5c"
              style="text-transform: none"
            >
              <span class="text-wrap">
                <v-icon>mdi-progress-clock</v-icon>
                {{ $t("orders.mark-as-pending") }}
              </span>
            </v-btn>
            <v-btn
              @click="changeOrderPaymentState('unpaid')"
              v-if="order.draft"
              outlined
              block
              class="pl-2 pr-2 mt-2 mb-2"
              color="#5c5c5c"
              style="text-transform: none"
            >
              <v-icon>mdi-progress-close</v-icon>
              {{ $t("orders.not-paid") }}
            </v-btn>
          </div>
        </v-card>

        <v-card>
          <h4 class="d-flex" style="flex-flow: wrap; justify-content: flex-end">
            <span>
              {{ $t("orders.invoices") }}
            </span>
            <v-spacer></v-spacer>
            <v-btn
              @click="generateInvoice"
              color="primary"
              outlined
              small
              style="text-transform: none"
            >
              <v-icon left>mdi-receipt</v-icon>
              {{ $t("orders.generate-invoice") }}
            </v-btn>
          </h4>
          <div
            v-if="!'NEW CANCELED'.includes(order.state.type)"
            class="invoices-list"
          >
            <div
              v-if="order.invoices.length == 0"
              style="
                text-align: center;
                color: #727272;
                font-size: 18px;
                font-weight: 300;
                margin-top: 25px;
                margin-bottom: 7px;
              "
            >
              {{ $t("orders.no-invoices") }}
            </div>
            <div
              v-for="invoice in order.invoices.slice().reverse()"
              :key="invoice.id"
              class="d-flex pa-2 mt-2"
              style="border: 1px solid grey; border-radius: 5px"
            >
              <span style="font-weight: bold">
                <span style="font-size: 18px"
                  >{{ $t("orders.invoice") }} #{{ invoice.number }}</span
                >
                <br />
                <small>{{ $t("-total") }}: {{ invoice.total }}</small>
                <br />
                <small style="color: grey">{{
                  invoice.formatted_created_at
                }}</small>
              </span>
              <v-spacer></v-spacer>
              <v-btn
                :href="$AuthKit.getBaseUrl() + invoice.url"
                target="_blank"
                xoutlined
                color="#1e1e1e"
                dark
                rel="noopener noreferrer"
                small
                style="text-transform: none"
              >
                {{ $t("common.open-pdf") }}
              </v-btn>
            </div>
          </div>
        </v-card>
      </div>
    </v-row>
    <div style="margin-bottom: 200px"></div>
  </div>
  <div
    v-else
    style="
      display: flex;
      justify-content: center;
      font-size: 22px;
      color: #8f8f8f;
      margin-top: 50px;
    "
  >
    {{ $t("orders.order-not-found") }}
  </div>
</template>

<script>
import ItemsList from "@/components/Orders/ItemsList.vue";
import SummaryTotal from "@/components/Orders/SummaryTotal.vue";

export default {
  data() {
    return {
      id: "",
      items_users: [],
      users: [],
      newOrderCustomerId: null,
      newOrderNote: null,
      editCustomer: false,
      editNote: false,
      dialog: false,
      customNote: null,
      invoiceAmount: 0,
    };
  },
  components: {
    ItemsList,
    SummaryTotal,
  },
  computed: {
    orderIsEmpty() {
      return !this.order.items.length;
      // return !this.order._total;
    },
    orders() {
      return this.$store.state.orders.orders;
    },
    order() {
      return this.orders.find((o) => o.id == this.id);
    },
    parsed_customNote() {
      return this.order.customNote.replace(/(?:\r\n|\r|\n)/g, "<br>");
    },
    notes() {
      var counter = 0;
      return this.order.items
        .map((item) => {
          counter++;
          return item.note
            ? {
                counter,
                content: item.data.note,
                name: item.data.name, //this.$modules.extractItemNameFromOrderItem(item),
              }
            : null;
        })
        .filter((note) => !!note);
    },
    loading: {
      get() {
        return this.$store.state.loading;
      },
      set(val) {
        this.$store.commit("SET_LOADING", val);
      },
    },
    variantsStructure() {
      return [
        {
          text: "Id",
          value: "id",
          type: "hidden",
        },
        {
          text: "Image",
          value: "image",
          type: "image",
        },
        {
          text: "Title",
          value: "title",
          type: "text",
        },
        {
          text: "Price",
          value: "price",
          type: "text",
        },
        {
          text: "SKU",
          value: "sku",
          type: "text",
        },
      ];
    },
  },
  async mounted() {
    this.asyncData();
    if (this.order) {
      //TODO load customNote if connection error and this line didn't load at mounting (Related to SockoetIO)
      this.customNote = this.order.customNote;
    }
  },
  methods: {
    async asyncData() {
      this.id = this.params.id;
      this.items_users = [];
      this.users = [];
      this.newOrderCustomerId = null;
      this.newOrderNote = null;
      this.editCustomer = false;
      this.editNote = false;
      this.dialog = false;
      this.customNote = null;
      this.invoiceAmount = 0;
      // variants: [],
    },
    async cancelOrder() {
      if (
        !(await this.$refs.cancelDialog.cp.confirm(
          this.$t("orders.cancel-this-order"),
          this.$t("orders.this-order-will-be-permanently-canceled")
        ))
      ) {
        this.loading = false;
        return;
      }
      this.changeOrderState("CANCELED");
    },
    async generateInvoice() {
      this.invoiceAmount = this.order._total;
      if (
        (await this.$refs.invoicePrice.cp.confirm(
          this.$t("orders.invoices-amount")
        )) &&
        this.invoiceAmount > 0
      ) {
        var orderId = this.order.id;
        this.$store.dispatch("startLoading");
        await this.$dataCaller(
          "post",
          "/api/generate-order-invoice/" + orderId + "/" + this.invoiceAmount
        )
          .then((data) => {
            // if(process.env.NODE_ENV !== 'production'){
            //   window.open(this.$AuthKit.getBaseUrl() + data.invoice.url, '_blank').focus();
            // }else{
            //   window.open(window.location.origin + data.invoice.url, '_blank').focus();
            // }
            // this.$store.dispatch("endLoading");
          })
          .catch((_) => {
            this.$toast.error(this.$t("orders.orders-invoice-error"));
          });
        this.$store.dispatch("endLoading");
      }
    },
    async enableEditCustomer() {
      await this.loadUsers();
      this.editCustomer = true;
    },
    async loadUsers() {
      if (this.users.length > 0) return;
      this.$store.dispatch("startLoading");
      this.users = await this.$dataCaller("get", "/api/all_users");
      this.items_users = [];
      for (var user of this.users) {
        this.items_users.push({
          text: user.email,
          value: user.id,
        });
      }
      this.$store.dispatch("endLoading");
    },
    // async loadVariants(){
    //   if(this.variants.length > 0) return;
    //   this.$store.dispatch("startLoading");
    //   this.variants = await this.$dataCaller("get", "/api/variants");
    //   this.$store.dispatch("endLoading");
    // },
    changeOrderState(newState) {
      var orderId = this.order.id;
      this.loading = true;
      this.$dataCaller("post", "/api/change-order-state", {
        orderId: orderId,
        newState: newState,
      })
        .then((_) => {
          this.$toast.success(this.$t("orders.order-updated"));
          this.loading = false;
        })
        .catch((_) => {
          this.$toast.error(this.$t("orders.order-not-updated"));
          this.loading = false;
        });
    },
    changeOrderPaymentState(newState) {
      var orderId = this.order.id;
      this.loading = true;
      this.$dataCaller("post", "/api/change-order-payment-state", {
        orderId: orderId,
        newState: newState,
      })
        .then((_) => {
          this.$toast.success(this.$t("orders.orders-payment-updated"));
          this.loading = false;
        })
        .catch((_) => {
          this.$toast.error(this.$t("orders.orders-payment-not-updated"));
          this.loading = false;
        });
    },
    getInvoice() {
      var orderId = this.order.id;
      this.loading = true;
      this.$dataCaller("get", "/api/get-order-invoice/" + orderId)
        .then((data) => {
          if (process.env.NODE_ENV !== "production") {
            window
              .open(this.$AuthKit.getBaseUrl() + data.invoice.url, "_blank")
              .focus();
          } else {
            window
              .open(window.location.origin + data.invoice.url, "_blank")
              .focus();
          }
          this.loading = false;
        })
        .catch((_) => {
          this.$toast.error(this.$t("orders.orders-invoice-error"));
          this.loading = false;
        });
    },
    setNewOrderCustomer(newOrderCustomerId) {
      this.newOrderCustomerId = newOrderCustomerId;
      var newOrderCustomer = this.users.find(
        (u) => u.id == this.newOrderCustomerId
      );
      var orderId = this.order.id;
      this.loading = true;
      this.$dataCaller("put", "/api/orders/" + orderId, {
        customer: newOrderCustomer,
        customerId: this.newOrderCustomerId,
      })
        .then((_) => {
          this.$toast.success("Order updated");
          this.loading = false;
          this.editCustomer = false;
        })
        .catch((_) => {
          this.$toast.error("Order not updated");
          this.loading = false;
        });
    },
    savecustomNote() {
      var orderId = this.order.id;
      this.loading = true;
      this.$dataCaller("put", "/api/orders/" + orderId, {
        customNote: this.customNote,
      })
        .then((_) => {
          this.$toast.success("Order updated");
          this.loading = false;
          this.editNote = false;
        })
        .catch((_) => {
          this.$toast.error("Order not updated");
          this.loading = false;
        });
    },
    cartDeleteItem(item) {
      //TODO Confirm Deletion
      //TODO Delete Item
      this.$store.dispatch("startLoading");
      this.$dataCaller(
        "delete",
        "/api/order_cart/" + this.id + "/" + item.id
      ).then((_) => {
        this.$store.dispatch("endLoading");
      });
    },
    cartAddItem() {
      this.$refs.variantsPicker.cp.enable();
    },
    dataPicker_addItem(item) {
      this.$store.dispatch("startLoading");
      this.$dataCaller("post", "/api/order_cart/" + this.id, {
        id: item.id,
        quantity: 1,
        type: "VARIANT",
      }).then((_) => {
        this.$store.dispatch("endLoading");
      });
    },
    cartUpdateQuantity(payload /** { item, quantity } */) {
      this.$store.dispatch("startLoading");
      this.$dataCaller("put", "/api/order_cart/" + this.id, {
        id: payload.item.id,
        quantity: payload.quantity,
      }).then((_) => {
        this.$store.dispatch("endLoading");
      });
    },
  },
};
</script>

<style >
.order-main-layout .main-section {
}

.order-main-layout .main-section .v-card {
  margin-top: 20px;
  padding: 20px;
}

.order-main-layout .v-card h4 {
  margin-bottom: 7px;
}

.order-main-layout .side-section {
}

.order-main-layout .side-section .v-card {
  margin-top: 20px;
  padding: 20px;
}

@media (min-width: 1060px) {
  .order-main-layout .side-section {
    flex: 0 0 35%;
    max-width: 35%;
    position: relative;
    width: 100%;
    padding-left: 20px;
  }
  .order-main-layout .main-section {
    flex: 0 0 65%;
    max-width: 65%;
    position: relative;
    width: 100%;
  }
}

@media (max-width: 1060px) {
  .order-main-layout .side-section {
    width: 100%;
  }
  .order-main-layout .main-section {
    width: 100%;
  }
}

.order-main-layout  {
  max-width: 935px;
  margin-left: calc((100% - 935px) / 2);
}

@media (max-width: 1270px) {
  .order-main-layout  {
    margin-left: 0px;
  }
}

@media (max-width: 550px) {
  /* No styles defined in this media query in the original SCSS */
}

.order-main-layout .return-breadcrumb {
  font-size: 15px;
  color: gray;
  margin-left: -7px;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.order-main-layout .order-header {
  margin-bottom: 20px;
}

.order-main-layout .order-header-content {
  display: flex;
  align-items: baseline;
}

.order-main-layout .payment-status {
  margin-left: 10px;
  font-size: 15px;
  color: gray;
  display: flex;
  align-items: center;
}

.order-main-layout .payment-status i {
  margin-right: 5px;
}

.order-main-layout .payment-status-paid {
  color: var(--v-success-base);
  font-weight: bold;
}

.order-main-layout .payment-status-paid .v-icon {
  color: var(--v-success-base);
}

.order-main-layout .payment-status-pending {
  color: var(--v-warning-base);
  font-weight: bold;
}

.order-main-layout .payment-status-pending .v-icon {
  color: var(--v-warning-base);
}

.order-main-layout .order-header-content .state-tag {
  display: flex;
  text-align: center;
  align-items: center;
  color: white;
  font-weight: 500;
  padding: 2px 15px;
  border-radius: 3px;
  font-size: 17px;
  opacity: 0.8;
}

.order-main-layout .order-header-content .state-tag i {
  font-size: 21px;
  margin-right: 7px;
}

.order-main-layout .order-header-buttons {
  display: flex;
  align-items: center;
}

.order-main-layout .state-btn {
  font-size: 16px;
  display: flex;
  text-align: center;
  align-items: center;
  margin-left: 5px;
  font-weight: 500;
  text-transform: none;
}

.order-main-layout .state-btn .v-icon {
  color: inherit;
  font-size: 21px;
  margin-right: 7px;
}

.order-main-layout .state-btn:hover {
  opacity: 0.8;
}

.order-main-layout .new-order-btn {
  box-shadow: 1px 1px 7px var(--v-success-base);
  background-color: var(--v-success-base);
}

.order-main-layout .draft-order-btn {
  box-shadow: 1px 1px 7px #747474;
  background-color: #747474;
}

.order-main-layout .preparation-order-btn {
  box-shadow: 1px 1px 7px #e6d116;
  background-color: #e6d116;
}

.order-main-layout .in_transit-order-btn {
  box-shadow: 1px 1px 7px var(--v-warning-base);
  background-color: var(--v-warning-base);
}

.order-main-layout .delivered-order-btn {
  box-shadow: 1px 1px 7px #00ad00;
  background-color: #00ad00;
}

.order-main-layout .canceled-order-btn {
  box-shadow: 1px 1px 7px var(--v-error-base);
  background-color: var(--v-error-base);
}

.btn-multiline {
  height: auto !important;
  min-height: 36px;
}

.btn-multiline > span {
  width: 100%;
}
</style>