import rp from "request-promise";

class IntegrationService {


    checkRequest(checkData) {

        let url = checkData.url;
        let headers = checkData.headers;
        let authentication = checkData.authentication;
        let timeout = checkData.timeout;

        let requestHeaders = this.getHeaders(authentication, headers)

        let request = rp({
            method: 'get',
            url: url,
            headers: requestHeaders,
            resolveWithFullResponse: true,
            timeout: timeout,
            time: true
        })

        return request
    }

    postPromise(url) {

        return rp({
            method: 'post',
            url: url,
            resolveWithFullResponse: true,
            timeout: 5,
            time: true
        })

    }
    getHeaders(authentication, headers) {

        let requestHeaders = {};

        if (typeof authentication == 'object' && Object.keys(authentication).length) {
            requestHeaders['authentication'] = authentication
        }

        if (typeof headers == 'object' && Object.keys(headers).length) {

            requestHeaders = { requestHeaders, ...headers }
        }

        return requestHeaders

    }
}

export default new IntegrationService();