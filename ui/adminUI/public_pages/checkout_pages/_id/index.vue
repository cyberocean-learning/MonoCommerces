<template>
	
</template>

<script>
export default {
  async mounted() {
      await this.asyncData()
  },
  methods:{
    asyncData(){
      this.$router.push("/public/"+this.$route.params.path+"/shipping");
      console.log("asyncData" , this.$route.params.path);
      console.log("params" , this.params);
      
    },
    
  },
}
</script>

<style>

</style>