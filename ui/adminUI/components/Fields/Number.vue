<template>
    <span>
        <v-text-field
            v-model="value"
            type="number"
            append-outer-icon="mdi-plus-circle"
            style="width:110px;padding: 0px;"
            @click:append-outer="increment" prepend-icon="mdi-minus-circle"
            @click:prepend="decrement"
            @change="changed"
            :disabled="disabled"
            >
        </v-text-field>
    </span>
</template>

<script>
export default {
    props:{
        "value": {
            type: Number,
            default: 0
        },
        "disabled": {
            type: Boolean,
            default: false
        },
    },
    data () {
        return {
            foo: 0
        }
    },
    methods: {
        changed () {
            this.foo = parseInt(this.value);
            this.$emit("input", this.foo);
        },
        increment () {
            this.foo = parseInt(this.value);
            this.foo = parseInt(this.foo) + 1;
            this.$emit("input", this.foo);
        },
        decrement () {
            this.foo = parseInt(this.value);
            this.foo = parseInt(this.foo) - 1;
            if(this.foo<0)this.foo = 0;
            this.$emit("input", this.foo);
        }
    }
}
</script>

<style>

</style>