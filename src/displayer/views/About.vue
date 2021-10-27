<template>
  <div class="about">
    <h1>This is an about page</h1>
  </div>
</template>

<script>
export default {
  async created() {
    // this.balances = await binance.futuresBalance();
    this.balances = await this.$binanceApi.futuresAccountBalance();
    console.log(this.balances);
  },
  data() {
    return {
      balances: null
    };
  }
};
</script>
