import Config from "../background/config.js"

const STACK_LINE_REGEX = /([a-z0-9\.-]+):(\d+):(\d+)\)?$/;

const logging = (type = 'log', ...args) => {
    let err = null
    try {
        throw new Error()
    } catch (error) {
        err = error
    }
    const stacks = err.stack.split("\n")
    const [, file, line] = STACK_LINE_REGEX.exec(stacks[3]);

    const time = (new Date() - Config.startTime) / 1000

    if (Config.debug) {
        if (type === 'table') {
            console.log(time + 's', '[' + file + ':' + line + ']')
            console.table(...args)
        } else {
            console[type](time + 's', '[' + file + ':' + line + ']', ...args)
        }
    }
}

const Log = (...args) => {
    logging('log', ...args)
}
Log.info = (...args) => {
    logging('info', ...args)
}
Log.warn = (...args) => {
    logging('warn', ...args)
}
Log.error = (...args) => {
    logging('error', ...args)
}
Log.debug = (...args) => {
    logging('debug', ...args)
}
Log.table = (...args) => {
    logging('table', ...args)
}

export default Log
