<template>
  <div class="bg-blue-500 rounded text-white p-6 text-left">
    <Items @itemClick="handleItemClick" :list="candle" />
  </div>
</template>

<script>
import Items from '@/displayer/components/Items';

export default {
  components: { Items },
  methods: {
    handleItemClick(e) {
      console.log(e);
    }
  },
  props: {
    candle: {
      type: Object,
      default: () => {}
    }
  }
};
</script>
