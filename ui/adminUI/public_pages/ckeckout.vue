<template>
	<div>test</div>
</template>

<script>
export default {
  async mounted () {
		console.log("--------- INDEX PAGE ----------");
    
		await this.$store.dispatch("startLoading");
    console.log("startLoading" , await this.$store.dispatch("startLoading"));
    var id = await this.$store.dispatch("draftOrder");
    console.log("draftOrder" , await this.$store.dispatch("draftOrder"));
    console.log("draftOrder id" ,id ); 
    
		// if(id) this.$router.push("/"+id);
  },
}
</script>

<style>

</style>