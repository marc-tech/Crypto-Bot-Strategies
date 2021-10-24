<template>
  <div class="bg-blue-500 rounded text-white p-6 text-left">
    <Items
      :selectedSeries="selectedSeries"
      @itemClick="e => $emit('itemClick', e)"
      :list="candle"
    />
  </div>
</template>

<script>
import Items from '@/displayer/components/Items';

export default {
  components: { Items },
  props: {
    candle: {
      type: Object,
      default: () => {}
    },
    selectedSeries: {
      type: Array,
      default: () => []
    }
  }
};
</script>
