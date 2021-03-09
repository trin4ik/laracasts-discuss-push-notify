<template>
  <div class="list">
    <div class="list-item transition" v-for="item in list" :class="{remove: item.remove}" :key="item.path">
      <div class="title">
        <a :href="item.path" v-html="item.title" />
      </div>
      <div class="action">
        <button class="btn btn-sm btn-error" @click="remove(item.path)"><i class="icon icon-delete"></i></button>
      </div>
    </div>
    <div class="list-item list-empty" v-if="!list.length">
      no items
    </div>
  </div>
</template>
<script>

import config from "../config"
import Message from "../../lib/Message";

export default {
  data () {
    return {
      list: [],
      loaded: false
    }
  },
  mounted () {
    (async () => {
      const list = await Message.send('load-threads')
      this.list = list.data
      this.$nextTick(() => {
        this.loaded = true
        this.$emit('setThreadCount', this.list.length)
      })
    })()
  },
  methods: {
    async remove (path) {
      const item = this.list.find(item => item.path === path)
      const remove = await Message.send('remove-thread', item)
      if (remove.success) {
        item.remove = true
        setTimeout(() => {
          this.list = this.list.filter(item => item.path !== path)
        }, config.transitionTime)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.list {
  max-height: 500px;
  overflow: auto;

  .list-item {
    border-bottom: 1px solid #ccc;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0 10px;
    overflow: hidden;
    height: 40px;

    &:hover {
      background-color: #ffff0022;
    }

    &:last-child {
      border-bottom: none;
    }

    &.remove {
      height: 0px;
      opacity: 0;
    }

    &.list-empty {
      justify-content: center;

      &.remove {
        height: 40px;
        transform: translateY(20px)
      }
    }

    .title {
      flex: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      padding-right: 10px;
    }
  }
}
</style>
