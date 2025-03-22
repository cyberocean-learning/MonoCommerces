module.exports = {
  namespaced: true,
  state: () => ({
    products: [],
    screen: "LOADING",
    data: null,
    order: null,
    loading: false,
    lang: {
      lang: "en",
      rtl: false,
    },
  }),
  mutations: {
    //Products
    SET_PRODUCTS(state, payload) {
      state.products = payload;
    },
    SET_NEW_PRODUCT(state, payload) {
      state.products.unshift(payload);
    },
    SET_UPDATED_PRODUCT(state, payload) {
      for (const key in state.products) {
        if (state.products[key].id == payload.id) {
          Vue.set(state.products, key, payload);
          break;
        }
      }
    },
    SET_DELETED_PRODUCT(state, payload) {
      for (const key in state.products) {
        if (state.products[key].id == payload.id) {
          state.products.splice(key, 1);
          break;
        }
      }
    },

    SET_SCREEN(state, payload) {
      state.screen = payload;
    },
    SET_DATA(state, payload) {
      state.data = payload;
    },
    SET_ORDER(state, payload) {
      state.order = payload;
    },
    SET_LOADING(state, payload) {
      state.loading = payload;
      // console.log("STOPPING -> "+state.loading);
    },
    SET_LANG(state, payload) {
      if (payload) state.lang = payload;
      console.log(state.lang);
      ["ar", "he", "fa", "ur", "yi", "sy", "ku", "az", "ps", "sd"].includes(state.lang.lang) ? state.lang.rtl = true : state.lang.rtl = false;

    }
  },
  actions: {
    //Products
    async getProductById(context, payload) {
      return this.$dataCaller("get", '/api/products/' + payload);
      // return context.state.products.find(e => e.id == payload);
    },
    async save_product(context, payload) {
      return this.$dataCaller("post", '/api/products', payload);
    },
    async edit_product(context, payload) {
      return this.$dataCaller("put", '/api/products/' + payload.id, payload);
    },
    async delete_product(context, payload) {
      console.log(payload);
      return this.$dataCaller("delete", '/api/products/' + payload.id,);
    },
    setProducts(context, payload) {
      console.log("Decompressing products ================");
      console.log("products_data");
      console.log(decompress(payload));
      context.commit("SET_PRODUCTS", decompress(payload));
    },
    setNewProduct(context, payload) {
      context.commit("SET_NEW_PRODUCT", payload);
    },
    setUpdatedProduct(context, payload) {
      context.commit("SET_UPDATED_PRODUCT", payload);
    },
    setDeletedProduct(context, payload) {
      context.commit("SET_DELETED_PRODUCT", payload);
    },
    async loadOrder(ctx, payload) {
      if (ctx.state.order == null || payload.forceReload) {
        try {
          var res = (await this.$dataCaller("get", "/api/checkout/order/" + payload.id)).data;
          ctx.commit("SET_ORDER", res.order);
          ctx.commit("SET_DATA", res.data);
          this.$i18n.locale = res.data.language;
          ctx.commit("SET_LANG", { lang: res.data.language });
        } catch (error) {
          if (error.response?.status == 406) {
            alert("LINK ERROR");
            // window.location = "/";
          } else if (error.response?.status == 401) {
            this.$router.push('/auth');
          } else {
            setTimeout(window.location.reload, 3000);
          }
        }
      }
      return ctx.state.order;
    },
    async completeOrder(ctx) {
      try {
        var data = (await this.$dataCaller("post", "/api/checkout/complete-order/" + ctx.state.order.id)).data;
      } catch (error) {
        if (error.response?.status == 406) {
          alert("LINK ERROR");
          // window.location = "/";
        } else if (error.response?.status == 405) {
          return null;
        } else if (error.response?.status == 401) {
          this.$router.push('/auth');
        } else {
          setTimeout(window.location.reload, 3000);
        }
      }
      return data;
    },
    async updateOrder(ctx, payload) {
      try {
        var res = (await this.$dataCaller("put", "/api/checkout/order/" + ctx.state.order.id, payload)).data;
        ctx.commit("SET_ORDER", res.order);
      } catch (error) {
        if (error.response?.status == 406) {
          // alert("LINK ERROR");
          window.location = "/account";
        } else if (error.response?.status == 401) {
          this.$router.push('/auth');
        } else {
          setTimeout(window.location.reload, 3000);
        }
      }
      return ctx.state.order;
    },
    async startLoading(ctx, payload) {
      ctx.commit("SET_LOADING", true);
    },
    async endLoading(ctx, payload) {
      // console.log("STOPPING");
      ctx.commit("SET_LOADING", false);
    },
    async dataIsLoaded(ctx, payload) {
      return ctx.state.data != null;
    },
    async submitOrder(ctx, payload) {
      return this.$dataCaller("post", "/api/checkout/submit", payload);
      // (await this.$dataCaller("get", "https://aggricus.com/api/checkout/data")).data;
    },
    async draftOrder(ctx, payload) {
      try {
        var res = (await this.$dataCaller("get", "/api/checkout/darft-order")).data;
        ctx.commit("SET_ORDER", res.order);
        ctx.commit("SET_DATA", res.data);
        this.$i18n.locale = res.data.language;
        ctx.commit("SET_LANG", { lang: res.data.language });
        return res.order.id;
      } catch (error) {
        var loadDataAction = await ctx.dispatch("loadData");
        if (error.response?.status == 406) {
          window.location = "/";
        } else if (error.response?.status == 401 && loadDataAction) {
          this.$router.push('/auth');
        } else {
          setTimeout(window.location.reload, 3000);
        }
        return null;
      }
    },
    async loadData(ctx, payload) {
      try {
        var result = (await this.$dataCaller("get", "/api/checkout/data")).data;
        ctx.commit("SET_SCREEN", "");
        ctx.commit("SET_DATA", result);
        this.$i18n.locale = result.language;
        ctx.commit("SET_LANG", { lang: result.language });
        if (result.cart.items.length == 0) {
          window.location = "/";
        }
        return result;
      } catch (error) {
        return null;
      }
    },
  },
  getters: {
  },
};
