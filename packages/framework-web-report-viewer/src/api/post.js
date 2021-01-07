function _addParam(key, value) {
    // If value is a function, invoke it and return its value
    value = Object.prototype.toString.call(value) === "Function" ? value() : (value == null ? "" : value);
    return encodeURIComponent(key) + "=" + encodeURIComponent(value);
};
/* 封装的原生post请求 */
export const postJSON = (url, data) => {

    return new Promise((resolve, reject) => {

        var xhr = new XMLHttpRequest()

        xhr.open("POST", url, true)

        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=utf-8");
        xhr.setRequestHeader("Accept", "application/json, text/javascript, */*; q=0.01");
        xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");

        xhr.onreadystatechange = function () {

            if (this.readyState === 4) {

                if (this.status === 200) {

                    resolve(JSON.parse(this.responseText), this)

                } else {

                    var resJson = {
                        code: this.status,
                        response: this.response
                    }

                    reject(resJson, this)

                }

            }

        }

        let postDataArr = [];

        for (var key in data) {
            postDataArr.push(_addParam(key, data[key]))
        }

        xhr.send(postDataArr.join("&").replace(/%20/g, "+"))

    })

}