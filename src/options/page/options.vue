<template>
  <div>
    <div class="form-group mt-2">
      <label class="form-switch">
        <input type="checkbox" v-model="config.enabled">
        <i class="form-icon"></i> Enabled notification
      </label>
    </div>
    <div class="container">
      <div class="columns">
        <div class="column col p-0">
          <label class="form-switch">
            <input type="checkbox" v-model="config.sound.enabled">
            <i class="form-icon"></i> Notification sound
          </label>
        </div>
        <div class="column col-auto p-0 transition" :class="{'opacity-0': !config.sound.enabled}">
          <div class="input-group">
            <input v-model="volume" class="mr-2" type="range" min="0" max="100" step="0">
            <input v-model="volume" class="form-input input-sm" style="width: 100px;" step="0" type="number" min="0"
                   max="100">
          </div>
        </div>
      </div>
    </div>
    <div class="divider"></div>
    <div class="container">
      <div class="columns mt-2">
        <div class="column col-auto p-0">
          Refresh interval <span class="text-gray">(min: 20, max: 180)</span>
        </div>
        <div class="column col">
          <input type="number" min="20" max="180" class="form-input input-sm" placeholder="30" v-model="interval">
        </div>
        <div class="column col-auto p-0">seconds</div>
      </div>

      <div class="columns mt-2">
        <div class="column col-auto p-0">
          Unsubscribe after <span class="text-gray">(min: 1, max: 30)</span>
        </div>
        <div class="column col">
          <input type="number" min="1" max="30" class="form-input input-sm" placeholder="30" v-model="trashTime">
        </div>
        <div class="column col-auto p-0">days without updates</div>
      </div>
    </div>
  </div>
</template>
<script>
import Message from "../../lib/Message"
import Log from "../../lib/Log"
import debounce from 'lodash/debounce'

export default {
  data () {
    return {
      config: {
        enabled: true,
        sound: {
          enabled: true,
          volume: .75,
        },
        interval: 30000,
        trashTime: 86400 * 3 * 1000,
      },
      threads: [],
      loaded: false
    }
  },
  mounted () {
    (async () => {
      const config = await Message.send('load-config')
      this.config = config.data
      this.$nextTick(() => {
        this.loaded = true
      })
    })()
  },
  methods: {
    saveConfig: debounce(async function (config) {
      this.loaded = false
      const newConfig = await Message.send('save-config', config)
      this.config = newConfig.data
      this.$nextTick(() => {
        this.loaded = true
      })
    }, 500)
  },
  watch: {
    config: {
      deep: true,
      handler (config) {
        if (this.loaded) {
          this.saveConfig(config)
        }
      }
    }
  },
  computed: {
    volume: {
      get () {
        return Math.round(this.config.sound.volume * 100)
      }
      ,
      set (val) {
        if (val < 1) {
          val = 1
        }
        if (val > 100) {
          val = 100
        }
        val = parseFloat(val / 100)
        this.config.sound.volume = val
      }
    }
    ,
    interval: {
      get () {
        return Math.round(this.config.interval / 1000)
      }
      ,
      set (val) {
        if (val < 20) {
          val = 20
        }
        if (val > 180) {
          val = 180
        }
        val = parseFloat(val * 1000)
        this.config.interval = val
      }
    }
    ,
    trashTime: {
      get () {
        return Math.round(this.config.trashTime / 1000 / 86400)
      }
      ,
      set (val) {
        if (val < 1) {
          val = 1
        }
        if (val > 30) {
          val = 30
        }
        val = parseFloat(val * 1000 * 86400)
        this.config.trashTime = val
      }
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
