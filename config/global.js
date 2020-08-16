//配置用户参数。。
module.exports = {
    _page: 0,
    _limit: 10,
    q: '',
    _sort: "time",

    //上传资源限定

    product: {
        uploadUrl: "/upload/product/"
    },
    user: {
        uploadUrl: "/upload/user/"
    },
    banner: {
        uploadUrl: "/upload/banner/"
    },
    normal : "/upload/default.gif"
}