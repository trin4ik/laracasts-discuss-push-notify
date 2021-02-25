import { h, Component, render } from '../vendor/preact.js'
import { useState, useEffect } from '../vendor/preact.hooks.js'
import htm from '../vendor/htm.js'
import Log from "../lib/log.js"
import Config from "../lib/config.js"
import Thread from "../lib/thread.js"
import Notify from "../lib/notify.js"

const html = htm.bind(h)

function App (props) {

    const [loading, setLoading] = useState(true)
    const [enabled, setEnabled] = useState(false)
    const [threads, setThreads] = useState([])

    useEffect(() => {
        return (async () => {
            const data = await Config.load()
            setEnabled(data.enabled)

            const list = await Thread.list()
            Log(list)
            setThreads(list)
            setLoading(false)
        })()
    }, [])

    const enabledHandler = async (e) => {
        const data = await Config.save({ enabled: !enabled })
        setEnabled(data.enabled)
    }

    const removeHadler = async (path) => {
        Log('thread remove', path)
        const result = await Thread.remove(path)
        if (result) {
            const item = threads.findIndex(item => item.path === path)
            threads[item].remove = true
            setThreads([...threads])
        }
    }

    const handlerTest = () => {
        Notify.test()
    }

    return html`
        <div class="row">
            <div class="form-item">
                <div class="form-label"><label for="enabled">Enabled notify</label></div>
                <div class="form-input">
                    <input id="enabled" type="checkbox" value="${enabled}" onClick="${enabledHandler}" />
                </div>
            </div>
        </div>
        <div class="row title">
            <h2>Notifications:</h2>
            <button class="test" onClick="${handlerTest}">test notify</button>
        </div>
        <div class="row">
            <div id="list">
                ${threads.filter(item => !item.remove).length ? html`
                    <ul>
                        ${threads.map(item => html`
                            <li class="${["form-item", ...(item.remove ? ["remove"] : [])].join(' ')}">
                                <div class="form-label"><a href="${Config.host + item.path}" target="_blank">${item.title}</a></div>
                                <div class="form-input">
                                    <button class="remove" onClick="${() => removeHadler(item.path)}">remove</button>
                                </div>
                            </li>
                        `)}
                    </ul>
                ` : html`
                    <div class="center"><span>no item</span></div>`}
            </div>
        </div>
        ${loading && html`
            <div class="loading"><span>loading...</span></div>`
        }
    `
}

render(html`
    <${App} name="World" />`, document.getElementById('root'))
