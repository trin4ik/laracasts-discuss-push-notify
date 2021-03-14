<template>
  <div>
    <div class="container">
      <p class="mt-2">
        Send notifications when new topics appear in selected categories
      </p>
      <div class="columns">
        <div class="column col-4">
          <label class="form-checkbox">
            <input type="checkbox" v-model="all">
            <i class="form-icon"></i> All
          </label>
        </div>
        <div class="column col-4" v-for="cat in category" :key="cat">
          <label class="form-checkbox">
            <input type="checkbox" v-model="cat.enabled">
            <i class="form-icon"></i>
            <span class="label label-rounded"
                  :style="{backgroundColor: cat.enabled ? cat.background : '#e2e2e2'}">{{
                cat.title
              }}</span>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Message from "../../lib/Message"
import Log from "../../lib/Log"

export default {
  data () {
    return {
      all: false,
      category: {},
      enabled: true,
      selected: {},
      loaded: false
    }
  },
  mounted () {
    (async () => {
      const category = await Message.send('load-categories')
      this.category = category.data

      let all = true
      Object.entries(this.category).map(item => {
        if (!item[1].enabled) {
          all = false
        }
      })
      if (all) {
        this.all = true
      }

      this.$nextTick(() => {
        this.loaded = true
        this.$emit('setCount', Object.entries(this.category).filter(item => item[1].enabled).length, 'category')
      })
    })()
  },
  created () {

    for (const cat in this.category) {
      console.log(this.category[cat])
      this.selected[this.category[cat]] = true
    }
  },
  methods: {
    changeHandler (cat) {
      console.log(cat, this.selected[cat])
      this.selected[cat] = !this.selected[cat]
    }
  },
  watch: {
    all (val) {
      if (!this.loaded) return
      if (val) {
        Object.entries(this.category).map(item => this.category[item[0]].enabled = true)
      } else {
        let unall = true
        Object.entries(this.category).map(item => {
          if (!this.category[item[0]].enabled) {
            unall = false
          }
        })
        if (unall) {
          Object.entries(this.category).map(item => this.category[item[0]].enabled = false)
        }
      }
    },
    category: {
      handler (val) {
        if (!this.loaded) return
        let count = 0
        let all = true
        const save = {}
        Object.entries(this.category).map(item => {
          save[item[0]] = this.category[item[0]].enabled
          if (!this.category[item[0]].enabled) {
            all = false
            this.all = false
          } else {
            count++
          }
        })
        if (all) {
          this.all = true
        }
        Message.send('save-categories', save)
        this.$emit('setCount', count, 'category')
      },
      deep: true
    }
  }
}
</script>
<style lang="scss" scoped>
input[type=checkbox] {
  &:checked {
    + i + span {
      opacity: 1;
    }
  }

  + i + span {
    transition: all .3s linear;
    opacity: .7;
  }
}
</style>
