<!-- components/TiptapEditor.vue -->


<template>
  <div v-if="editor" class="tiptap-editor-wrapper">
    <div class="control-group">
      <div class="button-group">
        <button @click="editor.chain().focus().toggleBold().run()"
          :disabled="!editor.can().chain().focus().toggleBold().run()"
          :class="{ 'is-active': editor.isActive('bold') }">
          <v-icon>mdi-format-bold</v-icon>
        </button>
        <button @click="editor.chain().focus().toggleItalic().run()"
          :disabled="!editor.can().chain().focus().toggleItalic().run()"
          :class="{ 'is-active': editor.isActive('italic') }">
          <v-icon>mdi-format-italic</v-icon>
        </button>
        <button @click="editor.chain().focus().toggleStrike().run()"
          :disabled="!editor.can().chain().focus().toggleStrike().run()"
          :class="{ 'is-active': editor.isActive('strike') }">
          <v-icon>mdi-format-strikethrough</v-icon>
        </button>
        <button @click="editor.chain().focus().toggleCode().run()"
          :disabled="!editor.can().chain().focus().toggleCode().run()"
          :class="{ 'is-active': editor.isActive('code') }">
          <v-icon>mdi-code-tags</v-icon>
        </button>
        <button @click="editor.chain().focus().unsetAllMarks().run()">
          <v-icon>mdi-format-clear</v-icon>
        </button>
        <button @click="editor.chain().focus().clearNodes().run()">
          <v-icon>mdi-delete</v-icon>
        </button>
        <button @click="editor.chain().focus().setParagraph().run()"
          :class="{ 'is-active': editor.isActive('paragraph') }">
          <v-icon>mdi-format-paragraph</v-icon>
        </button>
        <button @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
          :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }">
          <v-icon>mdi-format-header-1</v-icon>
        </button>
        <button @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
          :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }">
          <v-icon>mdi-format-header-2</v-icon>
        </button>
        <button @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
          :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }">
          <v-icon>mdi-format-header-3</v-icon>
        </button>
        <button @click="editor.chain().focus().toggleHeading({ level: 4 }).run()"
          :class="{ 'is-active': editor.isActive('heading', { level: 4 }) }">
          <v-icon>mdi-format-header-4</v-icon>
        </button>
        <button @click="editor.chain().focus().toggleHeading({ level: 5 }).run()"
          :class="{ 'is-active': editor.isActive('heading', { level: 5 }) }">
          <v-icon>mdi-format-header-5</v-icon>
        </button>
        <button @click="editor.chain().focus().toggleHeading({ level: 6 }).run()"
          :class="{ 'is-active': editor.isActive('heading', { level: 6 }) }">
          <v-icon>mdi-format-header-6</v-icon>
        </button>
        <button @click="editor.chain().focus().toggleBulletList().run()"
          :class="{ 'is-active': editor.isActive('bulletList') }">
          <v-icon>mdi-format-list-bulleted</v-icon>
        </button>
        <button @click="editor.chain().focus().toggleOrderedList().run()"
          :class="{ 'is-active': editor.isActive('orderedList') }">
          <v-icon>mdi-format-list-numbered</v-icon>
        </button>
        <button @click="editor.chain().focus().toggleHighlight().run()"
          :class="{ 'is-active': editor.isActive('highlight') }">
          <v-icon>mdi-marker</v-icon>
        </button>
        <button @click="editor.chain().focus().setTextAlign('left').run()"
          :class="{ 'is-active': editor.isActive({ textAlign: 'left' }) }">
          <v-icon>mdi-format-align-left</v-icon>
        </button>
        <button @click="editor.chain().focus().setTextAlign('center').run()"
          :class="{ 'is-active': editor.isActive({ textAlign: 'center' }) }">
          <v-icon>mdi-format-align-center</v-icon>
        </button>
        <button @click="editor.chain().focus().setTextAlign('right').run()"
          :class="{ 'is-active': editor.isActive({ textAlign: 'right' }) }">
          <v-icon>mdi-format-align-right</v-icon>
        </button>
        <button @click="editor.chain().focus().setTextAlign('justify').run()"
          :class="{ 'is-active': editor.isActive({ textAlign: 'justify' }) }">
          <v-icon>mdi-format-align-justify</v-icon>
        </button>
        <button @click="editor.chain().focus().toggleCodeBlock().run()"
          :class="{ 'is-active': editor.isActive('codeBlock') }">
          <v-icon>mdi-code-braces</v-icon>
        </button>
        <button @click="editor.chain().focus().toggleBlockquote().run()"
          :class="{ 'is-active': editor.isActive('blockquote') }">
          <v-icon>mdi-format-quote-close</v-icon>
        </button>
        <button @click="editor.chain().focus().setHorizontalRule().run()">
          <v-icon>mdi-minus</v-icon>
        </button>
        <button @click="editor.chain().focus().setHardBreak().run()">
          <v-icon>mdi-keyboard-return</v-icon>
        </button>
        <button @click="editor.chain().focus().undo().run()" :disabled="!editor.can().chain().focus().undo().run()">
          <v-icon>mdi-undo</v-icon>
        </button>
        <button @click="editor.chain().focus().redo().run()" :disabled="!editor.can().chain().focus().redo().run()">
          <v-icon>mdi-redo</v-icon>
        </button>
        <button @click="editor.chain().focus().setColor('#958DF1').run()"
          :class="{ 'is-active': editor.isActive('textStyle', { color: '#958DF1' }) }">
          <v-icon color="#958DF1">mdi-palette</v-icon>
        </button>
        <!-- Add Image Button -->
        <button @click="showImageDialog">
          <v-icon>mdi-image</v-icon>
        </button>
      </div>
    </div>
    <div class="editor-content tiptap">
      <editor-content :editor="editor" />
    </div>
    <!-- Image Dialog -->
    <v-dialog v-model="imageDialog" max-width="600px">
      <v-card>
        <v-card-title>
          Add Image
        </v-card-title>
        <v-card-text>
          <div style="position: relative; min-height: 147px" class="mb-5 loader-img">
            <CLoader v-model="selectedImage" cpn="KhaMedia" type="media" :singleFile="true" tag="picture"
              :InlineSingleItem="true" class="mb-5" />
          </div>

          <!-- Image Size Controls -->
          <v-container v-if="selectedImage">
            <v-row>
              <v-col cols="6">
                <v-text-field v-model="imageWidth" label="Width" type="number" suffix="px" outlined dense
                  @input="updateImagePreview"></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field v-model="imageHeight" label="Height" type="number" suffix="px" outlined dense
                  @input="updateImagePreview"></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12">
                <v-checkbox v-model="maintainAspectRatio" label="Maintain aspect ratio"
                  @change="updateImagePreview"></v-checkbox>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey darken-1" text @click="closeImageDialog">
            Cancel
          </v-btn>
          <v-btn color="primary" @click="insertImage" :disabled="!selectedImage">
            Insert Image
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import Highlight from '@tiptap/extension-highlight'
import { Editor, EditorContent } from '@tiptap/vue-2'
import StarterKit from '@tiptap/starter-kit'
import { Color } from '@tiptap/extension-color'
import ListItem from '@tiptap/extension-list-item'
import TextStyle from '@tiptap/extension-text-style'
import TextAlign from '@tiptap/extension-text-align'
import Image from '@tiptap/extension-image'
const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        parseHTML: element => element.style.width,
        renderHTML: attributes => {
          if (!attributes.width) {
            return {}
          }
          return {
            style: `width: ${attributes.width}; height: ${attributes.height};`,
          }
        },
      },
      height: {
        default: null,
        parseHTML: element => element.style.height,
        renderHTML: attributes => {
          if (!attributes.height) {
            return {}
          }
          return {}
        },
      },
    }
  },
})

export default {
  name: 'TiptapEditor',
  components: {
    EditorContent,
  },
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      editor: null,
      imageDialog: false,
      selectedImage: null,
      imageWidth: '',
      imageHeight: '',
      maintainAspectRatio: true,
      originalAspectRatio: 1,
    }
  },
  watch: {
    value(newValue) {
      // Only update content if editor content is different from new value
      const editorContent = this.editor.getHTML()
      if (newValue !== editorContent) {
        this.editor.commands.setContent(newValue)
      }
    }
  },
  mounted() {
    this.editor = new Editor({
      extensions: [
        Color.configure({ types: [TextStyle.name, ListItem.name] }),
        TextStyle.configure({ types: [ListItem.name] }),
        TextAlign.configure({ types: ['heading', 'paragraph'] }),
        StarterKit,
        CustomImage,
        Highlight,
      ],
      content: this.value,
      onUpdate: () => {
        this.$emit('input', this.editor.getHTML())
      }
    })
  },
  beforeDestroy() {
    if (this.editor) {
      this.editor.destroy()
    }
  },
  methods: {
    showImageDialog() {
      this.imageDialog = true
      this.resetImageControls()
    },

    closeImageDialog() {
      this.imageDialog = false
      this.resetImageControls()
    },

    resetImageControls() {
      this.selectedImage = null
      this.imageWidth = ''
      this.imageHeight = ''
      this.maintainAspectRatio = true
      this.originalAspectRatio = 1
    },

    onImageLoad() {
      if (this.$refs.previewImage) {
        const img = this.$refs.previewImage
        this.originalAspectRatio = img.naturalWidth / img.naturalHeight
        if (!this.imageWidth && !this.imageHeight) {
          this.imageWidth = img.naturalWidth
          this.imageHeight = img.naturalHeight
        }
      }
    },
    updateImagePreview() {
      if (this.maintainAspectRatio && this.$refs.previewImage) {
        if (this.imageWidth) {
          this.imageHeight = Math.round(this.imageWidth / this.originalAspectRatio)
        } else if (this.imageHeight) {
          this.imageWidth = Math.round(this.imageHeight * this.originalAspectRatio)
        }
      }
    },
    insertImage() {
      if (this.selectedImage) {
        const url = this.selectedImage.path || this.selectedImage.thumbnail
        if (url) {
          this.editor
            .chain()
            .focus()
            .setImage({
              src: url,
              width: `${this.imageWidth}px`,
              height: `${this.imageHeight}px`,
            })
            .run()
        }
      }
      this.closeImageDialog()
    },
  },
}
</script>

<style>
:root {
  --white: white;
  --black: black;
  --border-gray: #ccc;
  --gray-light: #f0f0f0;
  --gray-medium: var(--gray-2);
  --gray-dark: var(--gray-3);
  --highlight-purple: var(--purple-light);
}

/* Convert SCSS to CSS */
.tiptap-editor-wrapper {
  background-color: white;
}

.tiptap *:first-child {
  margin-top: 0;
}

.tiptap ul,
.tiptap ol {
  padding: 0 1rem;
  margin: 1.25rem 1rem 1.25rem 0.4rem;
}

.tiptap ul li p,
.tiptap ol li p {
  margin-top: 0.25em;
  margin-bottom: 0.25em;
}

.tiptap h1,
.tiptap h2,
.tiptap h3,
.tiptap h4,
.tiptap h5,
.tiptap h6 {
  line-height: 1.1;
  margin-top: 2.5rem;
}

.tiptap h1,
.tiptap h2 {
  margin-top: 3.5rem;
  margin-bottom: 1.5rem;
}

.tiptap h1 {
  font-size: 1.4rem;
}

.tiptap h2 {
  font-size: 1.2rem;
}

.tiptap h3 {
  font-size: 1.1rem;
}

.tiptap h4,
.tiptap h5,
.tiptap h6 {
  font-size: 1rem;
}

/* Code and preformatted text styles */
.tiptap code {
  background-color: var(--purple-light);
  border-radius: 0.4rem;
  color: var(--primary);
  font-size: 0.85rem;
  padding: 0.25em 0.3em;
}

.tiptap pre {
  background: var(--black);
  border-radius: 0.5rem;
  color: var(--white);
  font-family: 'JetBrainsMono', monospace;
  margin: 1.5rem 0;
  padding: 0.75rem 1rem;


}

.tiptap pre code {
  background: none;
  color: inherit;
  font-size: 0.8rem;
  padding: 0;
}

.tiptap blockquote {
  border-left: 3px solid var(--gray-3);
  margin: 1.5rem 0;
  padding-left: 1rem;
}

.tiptap hr {
  border: none;
  border-top: 1px solid var(--gray-2);
  margin: 2rem 0;
}

/* Add these new styles */
.control-group {
  margin-bottom: 20px;
  padding: 10px;
  border-bottom: 1px solid #ccc;
  display: flex;
}

.button-group {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.button-group button {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
}

.button-group button .v-icon {
  font-size: 20px;
}

.button-group button.is-active {
  background: #e0e0e0;
  border-radius: 15px;
}

.button-group button.is-active .v-icon {
  color: var(--v-primary-base);
}

.button-group button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Your existing .tiptap styles remain below */
.tiptap {
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 10px;
  min-height: 100px;
}

/* Add these new styles */
.preview-container {
  width: 100%;
  min-height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 10px;
  margin-top: 10px;
}

.preview-container img {
  max-width: 100%;
  object-fit: contain;
}

.tiptap img.tiptap-image {
  display: block;
  margin: 1rem auto;
  object-fit: contain;
}

/* For handling responsive images */
@media screen and (max-width: 768px) {
  .tiptap img.tiptap-image {
    width: 100% !important;
    height: auto !important;
  }
}

.loader-img img {
  max-height: 260px !important;
}
</style>
