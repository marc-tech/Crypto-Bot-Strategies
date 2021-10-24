<template>
  <div v-if="list">
    <div v-for="(item, index) in Object.entries(list)" :key="index">
      <div v-if="isIterable(item[1])" class="border">
        <div class="border px-2">
          {{ item[0] }}
        </div>
        <Items
          @itemClick="e => $emit('itemClick', e)"
          :list="item[1]"
          :parentName="parentName ? parentName + '.' + item[0] : item[0]"
          class="px-2"
        />
      </div>
      <div v-else class="flex justify-between">
        <div class="cursor-pointer" @click="itemClick(item[0])">
          <strong>
            {{ item[0] }}
          </strong>
        </div>
        <div>
          {{ item[1].toFixed ? item[1].toFixed(2) : item[1] }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Items from '@/displayer/components/Items';

export default {
  name: 'Items',
  components: { Items },
  methods: {
    itemClick(itemName) {
      if (this.parentName) {
        this.$emit('itemClick', this.parentName + '.' + itemName);
      } else {
        this.$emit('itemClick', itemName);
      }
    },
    isIterable(obj) {
      var elem = Object.keys(obj);
      return elem.length;
    }
  },
  props: {
    list: {
      tpye: Object,
      default: () => {}
    },
    parentName: {
      type: String,
      default: ''
    }
  }
};
</script>
