<template>
  <div id="settings">
    <div class="row">
      <div class="form-item">
        <div class="form-label"><label for="enabled">Enabled notify</label></div>
        <div class="form-input">
          <input id="enabled" type="checkbox" :value="config.enabled" @change="changeEnabled()" />
        </div>
      </div>
    </div>
    <div class="row">
      <div class="form-item">
        <div class="form-label"><label for="sound">Notification sound</label></div>
        <div class="form-input">
          <input id="sound" type="checkbox" :value="config?.sound?.enabled" @change="changeSound()" />
        </div>
      </div>
    </div>
    <div class="row title">
      <h2>Notifications:</h2>
      <button class="test" @click="test">test notify</button>
    </div>
    <div class="row">
      <div id="list" v-if="threads.filter(item => !item.remove).length">
        <ul>
          <li v-for="thread in threads" :class="{'form-item': true, 'remove': thread.remove}">
            <div class="form-label"><a :href="config.host + thread.path" target="_blank" v-html="thread.title" /></div>
            <div class="form-input">
              <button class="remove" @click="remove(thread.path)">remove</button>
            </div>
          </li>
        </ul>
      </div>
      <div class="center" v-if="!threads.filter(item => !item.remove).length"><span>no item</span></div>
    </div>
    <div class="loading" v-if="!loaded"></div>
    <div class="version">version: {{ version }}</div>
  </div>
</template>
<script>
import Message from "./lib/Message"
import Log from "./lib/Log";

export default {
  data () {
    return {
      version: browser.runtime.getManifest().version,
      config: {},
      threads: [],
      loaded: false
    }
  },
  mounted () {
    (async () => {
      const config = await Message.send('load-config')
      this.config = config.data
      Log('config', config)

      const threads = await Message.send('load-threads')
      this.threads = threads.data
      this.loaded = true
      this.$forceUpdate()
    })()
  },
  methods: {
    async changeEnabled () {
      const tmp = !this.config.enabled
      const result = await Message.send('save-config', { enabled: tmp })
      this.config.enabled = result.data.enabled
      this.$forceUpdate()
    },
    async changeSound () {
      const result = await Message.send('save-config', { sound: { ...this.config.sound, enabled: !this.config.sound.enabled } })
      this.config.sound.enabled = result.data.sound.enabled
      this.$forceUpdate()
    },
    test () {
      Message.send('test-notify')
    },
    async remove (path) {
      const result = await Message.send('remove-thread', { path })
      if (result.success) {
        this.threads.find(item => item.path === path).remove = true
      }
    }
  }
}
</script>
<style lang="scss" scoped>
#settings {
  padding: 5px 10px;
  display: flex;
  flex: 1;
  flex-direction: column;
  width: 500px;

  .title {
    display: flex;
    align-items: center;

    h2 {
      font-weight: 300;
      font-size: 1.5rem;
      flex: 1;
    }

    button {
      border: 1px solid dodgerblue;
      background-color: #fff;
      border-radius: 3px;
      color: dodgerblue;
      padding: 5px 10px;
      cursor: pointer;
    }
  }

  #list {
    max-height: 450px;
    overflow: auto;
    position: relative;
    left: -5px;
    width: calc(100% + 10px);

    ul {
      list-style: none;
      padding: 0;
      margin: 0;

      li {
        padding: 0 5px;
        opacity: 1;
        transition: all .3s linear;
        overflow: hidden;
        position: relative;
        height: 36px;

        &.remove {
          opacity: 0;
          height: 0px;
        }

        &:hover {
          background: #ffffc4;
          border-radius: 5px;
        }

        .form-label {
          font-size: .9rem;

          a {
            color: #5455ee;
          }
        }
      }
    }
  }

  .hidden {
    display: none;
  }

  .form-item {
    display: flex;
    flex: 1;
    flex-direction: row;
    align-items: center;

    .form-label {
      font-size: 1rem;
      flex: 1;
      color: #333;
    }

    .form-input {
      input[type=checkbox] {
        position: relative;
        appearance: none;
        outline: none;
        width: 50px;
        height: 30px;
        background-color: #ffffff;
        border: 2px solid #e2e2e2;
        border-radius: 50px;
        box-shadow: inset -20px 0 0 0 #e2e2e2;
        transition-duration: 200ms;

        &:after {
          content: "";
          position: absolute;
          top: 2px;
          left: 2px;
          width: 24px;
          height: 24px;
          background-color: transparent;
          border-radius: 50%;
          box-shadow: 2px 4px 6px rgba(0, 0, 0, 0.2);
        }

        &[value=true] {
          border-color: #4ED164;
          box-shadow: inset 20px 0 0 0 #4ED164;

          &:after {
            left: 20px;
            box-shadow: -2px 4px 3px rgba(0, 0, 0, 0.05);
          }
        }
      }
    }
  }

  .loading {
    position: absolute;
    flex: 1;
    display: flex;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ffffffcc;
    align-items: center;
    justify-content: center;
  }

  .center {
    display: flex;
    color: #666;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
  }

  .row {
    flex: 1;
    flex-direction: row;
  }

  button.remove {
    cursor: pointer;
    border: 1px solid #c8443f;
    border-radius: 3px;
    background: #fff;
    padding: 5px 15px;
    color: #c8443f;
  }

  .version {
    text-align: right;
    margin-top: 10px;
    color: #666;
  }
}

</style>
