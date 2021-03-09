<template>
  <div id="settings" :class="{notransition: !loaded}" :style="componentStyleVars">
    <ul class="tab">
      <li v-for="(tab, index) in tabs" class="tab-item" :class="{active: activeTab === index}"
          @click="activeTab = index">
        <a href="#" :class="{badge: tab.component === 'threads' && threadCount}" :data-badge="threadCount">
          {{ tab.title }}
        </a>
      </li>
      <li class="tab-item tab-action">
        <button class="btn btn-sm" @click="test()">Test notify</button>
      </li>
    </ul>
    <div class="content">
      <div class="content-wrapper" :style="wrapperStyle">
        <div v-for="tab in tabs" class="component-inner">
          <page-options v-if="tab.component === 'options'" />
          <page-threads v-if="tab.component === 'threads'" @setThreadCount="setThreadCount" />
        </div>
      </div>
    </div>
    <div class="version">version: {{ version }}</div>
  </div>
</template>
<script>
import config from "./config"
import Options from './page/options.vue'
import Threads from './page/threads.vue'
import Message from "../lib/Message"

export default {
  components: {
    'page-options': Options,
    'page-threads': Threads
  },
  data () {
    return {
      version: window.browser ? browser.runtime.getManifest().version : 'browser',
      tabs: [
        {
          title: 'Options',
          component: 'options'
        },
        {
          title: 'Threads',
          component: 'threads'
        }
      ],
      activeTab: 0,
      loaded: false,
      threadCount: 0
    }
  },
  mounted () {
    setTimeout(() => {
      this.loaded = true
    }, config.transitionTime)
  },
  methods: {
    test () {
      Message.send('test-notify')
    },
    setThreadCount (count) {
      this.threadCount = count
    }
  },
  computed: {
    componentStyleVars () {
      return {
        '--width': config.width + 'px',
        '--transition-time': config.transitionTime + 'ms'
      }
    },
    wrapperStyle () {
      return {
        'width': (this.tabs.length * config.width) + 'px',
        'transform': 'translateX(-' + (this.activeTab * config.width) + 'px)'
      }
    },
  }
}
</script>
<style lang="scss">
@import '~spectre.css';
@import '~spectre.css/src/spectre-icons';

.notransition {
  * {
    transition: none !important;
  }
}

#settings {
  margin: 5px 15px 5px;
  width: var(--width);

  .content {
    width: var(--width);
    overflow: hidden;

    .content-wrapper {
      transition: all .25s ease-out;
      display: flex;
      flex-direction: row;

      .component-inner {
        width: var(--width);
      }
    }
  }

  .version {
    text-align: right;
    color: #999;
    margin-top: 15px;
    font-size: .7rem;
  }

  .columns {
    align-items: center;
  }

  .opacity-0 {
    opacity: 0;
  }

  .transition {
    transition: all .25s ease-out;
  }

  .loading {
    > * {
      opacity: .5
    }
  }
}
</style>
