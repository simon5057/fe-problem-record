const defaultConf = {};

class InterceptorManager {
    constructor() {
        this.handlers = [];
    }
    use(fulfilled, rejected) {
        this.handlers.push({
            fulfilled,
            rejected
        })
    }
    each(fn) {
        Array.prototype.forEach.call(this.handlers, item => {
            if (item != null) fn(item);
        })
    }
}

function _fetch(config) {
    return new fetch(config).then(res => {
        if (!res.ok) return Promise.reject(res);
        return res;
    }, err => Promise.reject(err))
}

function Axios(config) {
    this.config = config;
    this.interceptors = {
        request: new InterceptorManager(),
        response: new InterceptorManager()
    };
}
Axios.prototype.interceptorRequest = function (fulfilled, rejected) {
    this.interceptors.request.use(fulfilled, rejected)
}
Axios.prototype.interceptorResponse = function (fulfilled, rejected) {
    this.interceptors.response.use(fulfilled, rejected)
}
Axios.prototype.request = function (config) {
    config.method = config.method.toLowerCase();
    config = Object.assign(defaultConf, this.conf, config);
    let chain = [{
        fulfilled: _fetch
    }];
    this.interceptors.request.each(function (interceptor) {
        chain.unshift({
            fulfilled: interceptor.fulfilled,
            rejected: interceptor.rejected
        })
    })
    this.interceptors.response.each(function (interceptor) {
        chain.push({
            fulfilled: interceptor.fulfilled,
            rejected: interceptor.rejected
        })
    })
    let promise = Promise.resolve(config);
    while (chain.length) {
        let step = chain.shift();
        promise = promise.then(step.fulfilled, step.rejected);
    }
    return promise;
}

Array.prototype.forEach.call(['get', 'delete'], method => {
    Axios.prototype[method] = function (url, conf) {
        this.request(Object.assign(conf, {
            method,
            url,
        }))
    }
});

Array.prototype.forEach.call(['post', 'put'], method => {
    Axios.prototype[method] = function (url, data, conf) {
        this.request(Object.assign(conf, {
            url,
            method,
            body: data,
        }))
    }
})

const instanceAxios = new Axios();

instanceAxios.interceptorRequest(conf => {
    // if (conf.url == '/login') {}
    // loading.open();
}, err => Promise.reject(err))

instanceAxios.interceptorResponse(res => {
    // loading.close();
}, err => {
    // if (err) {}
})