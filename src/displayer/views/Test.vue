<template>
  <div>
    <FetchCandles />
    <Charts />
  </div>
</template>

<script>
import FetchCandles from '@/displayer/components/FetchCandles';
import Charts from '@/displayer/components/Charts';

export default {
  components: { FetchCandles, Charts }
};
</script>
