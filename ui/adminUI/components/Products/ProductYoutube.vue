<template>
  <div>
    <div class="mb-2" style="font-size: 18px">
      <b><v-icon color="red" size="32" class="mr-2">mdi-youtube</v-icon>{{ $t("products.youtube-video") }}</b>
    </div>
    <v-divider class="mb-4"></v-divider>
    <v-text-field
      :value="value.youtubeVideo"
      @input="update('youtubeVideo', $event)"
      :label="$t('products.youtube-url')"
    />
    <div v-html="getYoutubeEmbedded(value.youtubeVideo, '100%')"></div>
  </div>
</template>

<script>
import { getYoutubeEmbedded } from "@/components/Helpers/Common";

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
  },
  methods: {
    getYoutubeEmbedded,
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
</style>