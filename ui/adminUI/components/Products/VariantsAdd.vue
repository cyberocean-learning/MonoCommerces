<template>
  <div>
    <v-dialog
        v-model="advancedVariantsManagement"
        max-width="600"
        >
        <v-card class="elevation-12" style="display:flex">
            <!-- <img src="/not_available.png" style="width:150px;padding:30px;" /> -->
            <h5 style="font-weight: normal;text-align:center;xwidth:calc( 100% - 200px );min-width:100px;padding:20px;align-self: center;color: #565656; padding-left: 10px; padding-right: 10px;">
                {{$t('products.advanced-variants-management-is-only-available-in-the-edit-page-so-please-save-your-product-first')}}
            </h5>
        </v-card>
    </v-dialog>
      <v-row>
            <v-col v-if="!noOptions && !enabled" cols="12" style="padding-bottom: 0px;padding-top: 0px;">
                <v-checkbox v-model="variantsEnabled" :label="$t('products.this-product-has-multiple-options-like-different-sizes-or-colors')" style="margin-top:0px;" />
                <v-divider style="margin-top: 0px" />
            </v-col>
            <v-col v-if="variantsEnabled" cols="12" style="padding-bottom: 0px;padding-top: 0px;">
                <b style="font-size: 13px;padding-bottom: 20px;">{{$t('products.options')}}</b>
                <!-- <div class="mb-1" style="font-size: 14px; font-weight: 500;">Weight</div> -->
                <v-row v-for="(option, index) in options" :key="option.id">
                    <v-col v-if="index > 0" cols="12" style="padding-bottom: 0px;padding-top: 0px;">
                        <v-divider style="margin-top: 0px;margin-bottom: 0px;" />
                    </v-col>
                    <v-col v-if="!noOptions" cols="12" style="padding-bottom: 0px;display: flex;">
                        <b>{{$t('products.option-n', { n: index+1 })}}</b>
                        <v-spacer/>
                        <v-btn v-if="options.length > 1" :disabled="editMode" small outlined @click="options.splice(index, 1)">{{$t('products.remove')}}</v-btn>
                    </v-col>
                    <v-col cols="3" style="padding-bottom: 0px;">
                        <b v-if="noOptions" class="primary-color">{{option.name}}</b>
                        <v-text-field
													v-else
													v-model="option.name"
													:placeholder="$t('products.name')"
													outlined
													dense
													:disabled="editMode"
												/>
                    </v-col>
                    <v-col cols="9" style="padding-bottom: 0px;" class="options-combobox">
                        <v-combobox
                            v-if="!noOptions"
                            v-model="option.values"
                            :placeholder="$t('products.separate-options-with-a-comma')"
                            chips
                            multiple
                            outlined
                            dense
                            deletable-chips
                            hide-no-data
                            :delimiters="[',']"
														:disabled="editMode"
                            >
                        </v-combobox>
                        <v-chip
                            v-else
                            class="mr-2"
                            color="accent"
                            text-color="white"
                            v-for="choice in option.values"
														:key="choice"
                            >
                            <!-- <v-avatar left>
                                <v-icon>mdi-account-circle</v-icon>
                            </v-avatar> -->
                            {{choice}}
                        </v-chip>
                    </v-col>
                </v-row>
                <v-btn @click="addOption" depressed :disabled="editMode" color="secondary" v-if="!noOptions" style="text-transform: none;">
									<v-icon class="mr-2">mdi-plus-circle-multiple</v-icon>
									{{$t('products.add-another-option')}}
								</v-btn>
                <v-divider class="mt-3 mb-3" />
                <div style="display:flex;">
                    <b style="font-size: 13px;padding-bottom: 20px;">{{$t('products.preview')}}</b>
                    <v-spacer />
                    <span style="text-align: right;">
                        <!-- <v-btn
                            v-if="!noOptions"
                            @click="advancedVariantsManagement = true"
                            style="xfloat: right;xmargin-top: -4px; xmargin-right: -4px; color: #2196F3;"
                            small
                            outlined>
                            Advanced variants Management
                        </v-btn> -->
                        <!-- <v-btn
                            v-if="noOptions"
                            nuxt
                            :to="'ID_'+product_id+'/variants'"
                            style="xfloat: right;xmargin-top: -4px; xmargin-right: -4px; color: #2196F3;"
                            small
                            outlined>
                            Advanced variants Management
                        </v-btn> -->
                        <span v-if="variants.length > 0 && !noOptions" style="display:flex;width: 100%;margin-top:5px;justify-content: flex-end;">
													<v-btn
														@click="closeAll"
														small
														outlined
														style="margin-right: 5px;"
														:disabled="editMode"
													>
														<v-icon small>mdi-close</v-icon> {{$t('products.all')}}
													</v-btn>
													<v-btn
														@click="refreshAll"
														small
														outlined
														:disabled="editMode"
													>
														<v-icon small>mdi-refresh</v-icon> {{$t('products.all')}}
													</v-btn>
                        </span>
                    </span>
                </div>
                <v-divider style="margin-bottom: 0px;margin-top: 5px;" />
                <v-row>
                    <v-col v-if="!noOptions" v-for="(variant, index) in variants" :key="variants[index].data.id" cols="12" style="xdisplay:block;padding-bottom: 0px;padding-top: 0px;">
                        <div
                            style="display: flex;padding-right: 5px;padding-left: 5px;padding-top: 10px;padding-bottom: 10px;align-items: center;"
                            :style="variant.deleted ? 'color: #dedede;' : ''"
                            >
                            <VariantPopup
                                v-model="variants[index].data"
                                Cstyle="display: inline-block;width: 100%;"
                                xinnerStyle="padding-top: 10px;padding-bottom: 10px;"
                                innerStyle="height: 100%;"
																:editMode="editMode"
                                >
                                <span
                                    v-for="(option, index) in options"
                                    :key="option.id"
                                    xstyle="padding-bottom: 15px;padding-top: 15px;" 
                                    style="display: inline-block;align-self: center;"
                                    >
                                    <b>{{variant.options[option.id]}}</b>
                                    <b v-if="index < options.length-1"> / </b>
                                </span>
                                <v-spacer />
                                <span v-if="variant.data.trackQuantity" style="font-size: 14px;text-align: right;padding-right: 5px;font-weight: 500;">
                                    {{getters.shopCurrency}} {{variant.data.price || '0.00'}} <br>
                                    {{variant.data.quantity || '0'}} {{$t('products.available-at-n-location-s', { n: 1})}}
                                </span>
                                <span v-else style="font-size: 14px;text-align: right;padding-right: 5px;font-weight: 500;">
                                    {{getters.shopCurrency}} {{variant.data.price || '0.00'}} <br>
                                    {{$t('products.stocked-at-n-location-s', { n: 1})}}
                                </span>
                            </VariantPopup>
                            <v-btn v-if="!editMode" @click="variant.deleted = !variant.deleted" x-small fab outlined :color="variant.deleted ? 'black' : '#bfbfbf'">
                                <v-icon v-if="variant.deleted">mdi-refresh</v-icon>
                                <v-icon v-else>mdi-close</v-icon>
                            </v-btn>
                        </div>
                        <v-divider style="margin-top: 0px;margin-bottom: 0px;" />
                    </v-col>
                    <v-col v-if="noOptions" v-for="(variant, index) in initVariants" :key="variants[index].data.id" cols="12" style="xdisplay:block;padding-bottom: 0px;padding-top: 0px;">
                        <div
                            style="display: flex;padding-right: 5px;padding-left: 5px;padding-top: 10px;padding-bottom: 10px;align-items: center;"
                            :style="variant.deleted ? 'color: #dedede;' : ''"
                            >
                            <VariantPopup
                                v-model="variants[index].data"
                                :noOptions="noOptions"
                                Cstyle="display: inline-block;width: 100%;"
                                xinnerStyle="padding-top: 10px;padding-bottom: 10px;"
                                innerStyle="height: 100%;"
																:editMode="editMode"
                                >
                                <img :src="variant.data.image ? variant.data.image.path : '/placeholder.png'" style="padding: 2px;width: 45px; height: 45px; object-fit: cover; border: 1px solid #d4d4d4; border-radius: 3px; margin-right: 8px;" />
                                <span
                                    v-for="(option, index) in options"
                                    :key="option.id"
                                    xstyle="padding-bottom: 15px;padding-top: 15px;" 
                                    style="display: inline-block;align-self: center;"
                                    >
                                    <b>{{variant.options[option.id]}}</b>
                                    <b v-if="index < options.length-1"> / </b>
                                </span>
                                <v-spacer />
                                <span v-if="variant.data.trackQuantity" style="font-size: 14px;text-align: right;padding-right: 5px;font-weight: 500;">
                                    {{getters.shopCurrency}} {{variant.data.price || '0.00'}} <br>
                                    {{variant.data.quantity || '0'}} {{$t('products.available-at-n-location-s', { n: 1})}}
                                </span>
                                <span v-else style="font-size: 14px;text-align: right;padding-right: 5px;font-weight: 500;">
                                    {{getters.shopCurrency}} {{variant.data.price || '0.00'}} <br>
                                    {{$t('products.stocked-at-n-location-s', { n: 1})}}
                                </span>
                            </VariantPopup>
                        </div>
                        <v-divider style="margin-top: 0px;margin-bottom: 0px;" />
                    </v-col>
                </v-row>
          </v-col>
      </v-row>
  </div>
</template>

<script>
import VariantPopup from "@/components/Variants/VariantPopup.vue";

export default {
    components: {
        VariantPopup,
    },
    props: {
			value: {
				required: true,
			},
			defaultVariant: "",
			initVariants: "",
			product_id: "",
			noOptions: {
					type: Boolean,
					default: false
			},
			editMode: {
					type: Boolean,
					default: false
			},
			enabled: {
					type: Boolean,
					default: false
			},
    },
    computed: {
			shop(){
				return this.$store.state.shop;
			},
			getters(){
				return this.$store.getters;
			},
		},
    data(){
        return {
            // uniqueid: 1,
            variantsEnabled: false,
            advancedVariantsManagement: false,
            oldOptions: [
                // {
                //     id: "_100000000000",
                //     name: "Size",
                //     values: []
                // }
            ],
            options: [
                // {
                //     id: "_100000000000",
                //     name: "Size",
                //     values: []
                // }
            ],
            variants: [
                // {
                //     options: [],
                //     data: {}
                // }
            ],
						skipWatchingOptionsAndVariants: false,
        };
		},
		mounted(){
			this.skipWatchingOptionsAndVariants = true;
			if(this.enabled){
				this.variantsEnabled = true;
			}
			var variants = JSON.parse(JSON.stringify(this.value?.variantsData || [] ));
			for (var item of variants) {
				if(!item.data){
					item.data = this.getNewVariant();
				}
			}
			this.variants = variants;
			// var variants = [];
			// for(var variant of (this.value.variantsData ? this.value.variantsData.variants : [])){
			// 	variants.push({
			// 		...variant,
			// 		data: JSON.parse(JSON.stringify(this.value.variants ? this.value.variants.find(v => v.id == variant.data) : {})),
			// 	});
			// }
			// this.variants = variants;
			this.options = JSON.parse(JSON.stringify((this?.value?.optionsData && this?.value?.optionsData?.length > 0) ?
					this?.value?.optionsData
				:
					[
						{
							id: "_100000000000",
							name: this.$t('products.type'),
							values: []
						}
					]
			));
			this.oldOptions = JSON.parse(JSON.stringify(this.options));
			var _vm = this;
			this.$nextTick(() => {
				_vm.skipWatchingOptionsAndVariants = false;
			});
		},
    methods: {
				emitChanges(){
					// var variantsData = [];
					// var variants = [];
					// for(var variant of this.variants){
					// 	variants.push(variant.data);
					// 	variantsData.push({
					// 		...variant,
					// 		data: variant.data.id,
					// 	});
					// }
					this.$emit("input", {
						...this.value,
						variantsData: this.variants,
						optionsData: this.options,
					});
				},
        addOption(){
            // this.uniqueid++;
            // var key = (new Date()).getTime() + this.uniqueid;
            this.options.push({
                    id: this.get_uniqueid(),//this.$store.dispatch("models/"),
                    name: "",
                    values: []
                });
        },
        closeAll(){
            for(var i = 0 ; i < this.variants.length ; i++){
                this.variants[i].deleted = true;
            }
        },
        refreshAll(){
            for(var i = 0 ; i < this.variants.length ; i++){
                this.variants[i].deleted = false;
            }
        },
        getNewVariant(){
            // var dfl = JSON.parse(JSON.stringify(this.defaultVariant.data));
            // var key = this.get_uniqueid();
            // dfl.key = key;
            // return dfl;
						return {
							id: this.get_uniqueid(),
							shipping: {},
							// options: [],
							// data: {},
						};
            // console.log(this.get_uniqueid());
            // return this.variant_model();//this.$store.dispatch("models/variant_model");
            // this.uniqueid++;
            // var key = (new Date()).getTime() + this.uniqueid;
            // return {
            //     key: "_"+key,
            //     image_cfile: "",
            //     barcode: "123bar",
            //     sku: "234sku",
            //     price: "567.99",
            //     compare_at_price: "600",
            //     option: null,
            //     weight: "0.8",
            //     quantity: "3",

            //     // sku: null,
            //     // barcode: null,
            //     trackQuantity: true,
            //     continueOutOfStock: true,
            //     // quantity: 0
            // };
        },
        sortVariants(){
            this.variants.sort(function (a, b) {
                var a_val = 0;
                var b_val = 0;
                var index = 0;
                // console.log("kwayes");
                for(var option of this.options){
                    // console.log("kwayes index=",index);
                    // console.log("kwayes option=",option);
                    // console.log("kwayes a=",a);
                    // console.log("kwayes b=",b);
                    a_val += option.values.indexOf(a.options[option.id]) * ( 1000000 / Math.pow(100, index) );
                    b_val += option.values.indexOf(b.options[option.id]) * ( 1000000 / Math.pow(100, index) );
                    index++;
                }
                // console.log("a=", a);
                // console.log("a=", b);
                if (a_val > b_val) {
                    return 1;
                }
                if (b_val > a_val) {
                    return -1;
                }
                return 0;
            }.bind(this));
        },
        generateVariants(_option, _choice, op1, op2){
            if(op1 == null && op2 == null){
                var options = {};
                options[_option.id] = _choice;
                var vr = {
                    options: options,
                    deleted: false,
                    data: this.getNewVariant(),
                };
                this.variants.push(vr);
                // console.log(vr);
            }else if(op2 == null){
                for(let choice of op1.values){
                    var options = {};
                    options[_option.id] = _choice;
                    options[op1.id] = choice;
                    var vr = {
                        options: options,
                        deleted: false,
                        data: this.getNewVariant(),
                    };
                    this.variants.push(vr);
                }
            }else{
                for(let ch1 of op1.values){
                    for(let ch2 of op2.values){
                        var options = {};
                        options[_option.id] = _choice;
                        options[op1.id] = ch1;
                        options[op2.id] = ch2;
                        var vr = {
                            options: options,
                            deleted: false,
                            data: this.getNewVariant(),
                        };
                        this.variants.push(vr);
                    }
                }
            }
            return ;
        },
    },
    watch: {
      options: {
          deep: true,
          handler(val) {
						if(this.skipWatchingOptionsAndVariants) return;
            if(this.noOptions) return;
            if (val.length > 3) {
                this.$nextTick(() => this.options.pop())
                return ;
            }
            var namesChanged = false
            var _option = null;
            var optionAdded = false;
            var optionDeleted = false;
            var _choice = null;
            var choicesAdded = false;
            var choicesDeleted = false;

            //namesChanged Check
            for(var i = 0 ; i < this.oldOptions.length ; i++){
                if(this.options[i] == null){ break; }
                if(this.options[i].name != this.oldOptions[i].name && this.options[i].id == this.oldOptions[i].id){
                    namesChanged = true;
                    // console.log("namesChanged");
                }
            }

            if(!namesChanged){
                //optionAdded Check
                if(this.options.length > this.oldOptions.length){
                    optionAdded = true;
                    _option = this.options[this.options.length - 1];
                    // console.log("optionAdded");
                    // console.log(_option);
                }

                //optionDeleted Check
                if(this.options.length < this.oldOptions.length){
                    optionDeleted = true;
                    _option = null;
                    for(var i = 0 ; i < this.options.length ; i++){
                        if(this.options[i].id != this.oldOptions[i].id){
                            _option = this.oldOptions[i];
                            break;
                        }
                    }
                    if(_option == null){
                        _option = this.oldOptions[this.oldOptions.length - 1];
                    }
                    // console.log("optionDeleted");
                    // console.log(_option);
                }

                if(!optionAdded && !optionDeleted){
                    //choicesAdded, choicesDeleted Check
                    for(var i = 0 ; i < this.options.length ; i++){
                        //choicesAdded
                        if(this.options[i].values.length > this.oldOptions[i].values.length){
                            _option = this.options[i];
                            _choice = this.options[i].values[this.options[i].values.length - 1];
                            choicesAdded = true;
                            // console.log("choicesAdded");
                            // console.log(_choice);
                        }
                        //choicesDeleted
                        if(this.options[i].values.length < this.oldOptions[i].values.length){
                            _option = this.oldOptions[i];
                            _choice = null;
                            for(var j = 0 ; j < this.options[i].values.length ; j++){
                                if(this.options[i].values[j] != this.oldOptions[i].values[j]){
                                    _choice = this.oldOptions[i].values[j];
                                    break;
                                }
                            }
                            if(_choice == null){
                                _choice = this.oldOptions[i].values[this.oldOptions[i].values.length - 1];
                            }
                            choicesDeleted = true;
                            // console.log("choicesDeleted");
                            // console.log(_choice);
                        }
                    }

                }
            }//End all Checks
            // console.log("Checks DONE ----------------");

            //Variants generation
            if(choicesAdded){
                //If first choice in an option
                if(_option.values.length == 1){
                    // console.log("first choice in an option");
                    if(this.variants.length == 0){
                        //Create new variant if first ever choice
                        // var options = {};
                        // options[_option.id] = _choice;
                        // this.variants.push({
                        //     options: options,
                        //     data: this.getNewVariant(),
                        // });
                        this.generateVariants(_option, _choice, null, null);
                    }else{
                        //Add to all variants
                        for(var variant of this.variants){
                            variant.options[_option.id] = _choice;
                        }
                    }
                }else{
                    // console.log("not first choice");
                    //If not first choice in an option
                    if(this.options[1]) {
                        // if(this.options[2]) {
                        //     //Three levels
                        //     if(this.options[0].id == _option.id){
                        //         //Create variants with all of the second and third options with the new choice fixed
                        //         this.generateVariants(_option, _choice, this.options[1], this.options[2]);
                        //     }else if(this.options[1].id == _option.id){
                        //         //Create variants with all of the first and third options with the new choice fixed
                        //         this.generateVariants(_option, _choice, this.options[0], this.options[2]);
                        //     }else if(this.options[2].id == _option.id){
                        //         //Create variants with all of the first and second options with the new choice fixed
                        //         this.generateVariants(_option, _choice, this.options[0], this.options[1]);
                        //     }

                        // }else{
                        //     //Two levels
                        //     if(this.options[0].id == _option.id){
                        //         //Create variants with all of the second options with the new choice fixed
                        //         this.generateVariants(_option, _choice, this.options[1], null);
                        //     }else if(this.options[1].id == _option.id){
                        //         //Create variants with all of the first options with the new choice fixed
                        //         this.generateVariants(_option, _choice, this.options[0], null);
                        //     }
                        // }
                        //-------------------------------------------------------
                        if(this.options[2]) {
                            // console.log("Three levels");
                            //Three levels
                            var index = 0;
                            for(var option of this.options){
                                // console.log("Checking option=", option);
                                if(option.id == _option.id){
                                    var op1 = (index+1) % 3;
                                    var op2 = (index+2) % 3;
                                    this.generateVariants(_option, _choice, this.options[op1], this.options[op2]);
                                    break;
                                }
                                index++;
                            }
                        }else{
                            // console.log("Two levels");
                            //Two levels
                            var index = 0;
                            for(var option of this.options){
                                // console.log("Checking option=", option);
                                if(option.id == _option.id){
                                    var op1 = (index+1) % 2;
                                    this.generateVariants(_option, _choice, this.options[op1], null);
                                    break;
                                }
                                index++;
                            }
                        }
                    }else{
                        //One level
                        // var options = {};
                        // options[_option.id] = _choice;
                        // var vr = {
                        //     options: options,
                        //     data: getNewVariant(),
                        // };
                        // this.variants.push(vr);
                        // console.log("One level");
                        this.generateVariants(_option, _choice, null, null);
                    }
                }
            }
            // console.log("Before Deletion");
            // console.log(this.variants);

            //Variants Deletion
            if(optionDeleted){
                if(_option.values.length > 0){
                    for(var j = 1; j < _option.values.length ; j++){
                        var ch = _option.values[j];
                        for(var i = 0; i < this.variants.length ; i++){
                            if(this.variants[i].options[_option.id] == ch){
                                this.variants.splice(i,1);
                                i--;
                            }
                        }
                    }
                    for(var variant of this.variants){
                        delete variant.options[_option.id];
                    }
                }
            }
            if(choicesDeleted){
                if(_option.values.length == 1){
                    for(var variant of this.variants){
                        delete variant.options[_option.id];
                    }
                }else{
                    for(var i = 0; i < this.variants.length ; i++){
                            // console.log("Cheking ... i=",i);
                        if(this.variants[i].options[_option.id] == _choice){
                            this.variants.splice(i,1);
                            i--;
                            // console.log("Should be deleted i=",i);
                        }
                    }
                }
            }
            if(optionDeleted || choicesDeleted){
                var emptyAll = true;
                for(var option of this.options){
                    if(option.values.length > 0){
                        emptyAll = false;
                    }
                }
                if(emptyAll){
                    this.variants.splice(0, this.variants.length);
                }
            }

            // console.log("After Deletion");
            // console.log(this.variants);

            this.sortVariants();

            // console.log("After Sorting");
            // console.log(this.variants);

            this.oldOptions = JSON.parse(JSON.stringify(this.options));
						this.emitChanges();
        }
      },
			variants: {
				deep: true,
				handler() {
					if(this.skipWatchingOptionsAndVariants) return;
					this.emitChanges();
        }
			},
    },
}
</script>

<style scoped>

.primary-color {
    color: var(--v-primary-base);
}

.options-combobox input {
    flex-basis: 100% !important;
}

</style>