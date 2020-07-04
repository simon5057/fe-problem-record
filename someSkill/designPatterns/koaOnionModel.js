app.use(async function (ctx, next) {
    console.log('中间件1 req');
    await next();
    console.log('中间件1 res')
})
app.use(async function (ctx, next) {
    console.log('中间件2 req');
    await next();
    console.log('中间件2 res')
})


function compose(middleware) {
    return function (context, next) {
        let index = -1;

        function dispatch(i) {
            if (i <= index) return Promise.reject('next() called multiple times');
            index = i;
            let fn = middleware[i];
            if (i === middleware.length) fn = next;
            if (!fn) return Promise.resolve();
            try {
                return Promise.resolve(fn(context, function () {
                    dispatch(i + 1);
                }))
            } catch (err) {
                return Promise.reject(err);
            }
        }
        return dispatch(0);
    }
}