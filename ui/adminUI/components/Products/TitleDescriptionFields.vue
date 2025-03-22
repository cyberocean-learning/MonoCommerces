<template>
  <div>
    <!-- Title -->
    <label>{{ $t("products.title") }}</label>
    <v-text-field
      ref="title"
      :rules="rules.title"
      :value="product.title"
      @input="update('title', $event)"
      :placeholder="$t('products.awesome-t-shirt')"
      outlined
      dense
      flat
      counter="250"
      autocomplete
    />
    <label>{{ $t("products.description") }}</label>
    <div class="red--text font-size-20">
      {{
        rulesPrinter(product.description, rules.description, firstValidation)
      }}
    </div>
    <!-- <v-textarea
      
      rows="10"
      :value="product.description"
      @input="update('description', $event)"
    ></v-textarea> -->
    <tiptap-editor
      v-model="product.description"
      @input="update('description', $event)"
    />
    <!-- <TiptapVuetify
			:value="product.description"
			@input="update('description', $event)"
			:extensions="extensions"
			:card-props="{ flat: true, style: 'padding: 0px;', outlined: true }"
		>
			<template #image="{ buttons, commands, isActive }">
				You can render the buttons as you wish (you can see in the source code how this is done).
				<pre>{{ buttons }}</pre>
			</template>
		</TiptapVuetify> -->
    <!-- tinymce-script-src="/tinymce.4.9.2/tinymce.min.js"
				:init="{
						branding: false,
						menubar: false,
						toolbar:
								'undo redo | formatselect | insert image | bold italic backcolor | \
								alignleft aligncenter alignright alignjustify | \
								bullist numlist outdent indent | removeformat',
						plugins: [
								//'advlist autolink lists link image charmap print preview anchor',
								//'searchreplace visualblocks code fullscreen',
								//'insertdatetime media table paste code help wordcount'
								'lists link image charmap anchor autoresize media table paste code'
						],
						autoresize_bottom_margin: 20,
						file_picker_callback: file_picker_callback
				}" -->
    <CLoader
      cpn="FilesInput"
      ref="picker"
      xv-model="picker.file"
      @input="pickerInput"
      pickerMode
      SingleFile
    />
  </div>
</template>

<script>
// import {
// 	TiptapVuetify,
// 	Heading,
// 	Bold,
// 	Italic,
// 	Strike,
// 	Underline,
// 	Image,
// 	// Code,
// 	// Paragraph,
// 	BulletList,
// 	OrderedList,
// 	ListItem,
// 	Link,
// 	// Blockquote,
// 	// HardBreak,
// 	// HorizontalRule,
// 	// History
// } from 'tiptap-vuetify';

import { rulesValidator, rulesPrinter } from "@/components/Helpers/Common";
// import FileSelector from "@/components/Products/FileSelector.vue";
import TiptapEditor from '@/components/TiptapEditor.vue';


export default {
  props: {
    value: {
      required: true,
    },
    title: {
      default: "",
    },
    description: {
      default: "",
    },
  },
  components: {
    // TiptapVuetify,
    TiptapEditor
  },
  data() {
    return {
      firstValidation: false,
      picker: {
        file: null,
        callback: null,
      },
      rules: {
        title: [
          this.$Jvalidator.rules.required(
            this.$t("products.title-is-required")
          ),
          this.$Jvalidator.rules.minLength(
            5,
            this.$t("products.title-should-be-at-least-5-characters")
          ),
          this.$Jvalidator.rules.maxLength(
            250,
            this.$t("products.title-should-not-be-more-than-250-characters")
          ),
        ],
        description: [
          this.$Jvalidator.rules.required(
            this.$t("products.description-is-required")
          ),
          this.$Jvalidator.rules.minLength(
            5,
            this.$t("products.description-should-be-at-least-15-characters")
          ),
          // this.$Jvalidator.rules.maxLength(250, "Description should not be more than 250 characters."),
        ],
      },
      // extensions: [
      //   Bold,
      //   [
      //     Heading,
      //     {
      //       options: {
      //         levels: [1, 2, 3],
      //       },
      //     },
      //   ],
      //   // History,
      //   // Blockquote,
      //   Link,
      //   Underline,
      //   Strike,
      //   Italic,
      //   ListItem,
      //   BulletList,
      //   OrderedList,
      //   // Code,
      //   // HorizontalRule,
      //   // Paragraph,
      //   // HardBreak,
      //   // Image,
      //   // new Image(null, null, upload),
      //   [
      //     Image,
      //     {
      //       options: {
      //         imageSources: [
      //           // { component: FileSelector, name: 'File Selector' }
      //         ],
      //       },
      //     },
      //   ],
      // ],
    };
  },
  computed: {
    product() {
      return this.value ? this.value : {};
    },
  },
  methods: {
    rulesPrinter: rulesPrinter,
    validate() {
      this.firstValidation = true;
      this.$refs.title.validate(true);
      return (
        rulesValidator(this.product.title, this.rules.title) &&
        rulesValidator(this.product.description, this.rules.description)
      );
    },
    update(key, val) {
      var obj = {
        ...this.value,
        [key]: val,
      };
      this.$emit("input", obj);
    },
    showPicker() {
      this.$refs.picker.showPopup();
    },
    pickerInput(cfile) {
      this.picker.file = cfile;
      // this.picker.callback("/api/media/get/"+cfile.id, {alt: cfile.name});
      this.picker.callback(cfile.path, { alt: cfile.name });
    },
    file_picker_callback(callback, value, meta) {
      // Provide file and text for the link dialog
      if (meta.filetype == "file") {
        //callback('mypage.html', {text: 'My text'});
      }

      // Provide image and alt text for the image dialog
      if (meta.filetype == "image") {
        this.showPicker();
        this.picker.callback = callback;
        //callback('myimage.jpg', {alt: 'My alt text'});
      }

      // Provide alternative source and posted for the media dialog
      if (meta.filetype == "media") {
        //callback('movie.mp4', {source2: 'alt.ogg', poster: 'image.jpg'});
      }
    },
  },
};
</script>

<style>
.tiptap-vuetify-editor__content img {
  width: 100%;
}
</style>