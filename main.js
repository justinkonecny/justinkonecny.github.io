import Vue from 'vue'
import App from './App.vue'

/* eslint-disable no-console */
let adList = [];

Vue.config.productionTip = false;
let vue = new Vue({
    data: function() {
        return {
            advertisementList: adList,
            imageCount: 0
        }
    },
    render: ren => ren(App),
}).$mount('#app'); //el: '#app'

function parseResponse(doc) {
    let rowsHTML = doc.getElementsByClassName('rows');
    let liHTML = rowsHTML.item(0).getElementsByClassName('result-row');

    let count_total = 0;
    let count_valid = 0;

    // parses the listings titles and creates the advertisements
    for (let i = 0; i < liHTML.length; i++) {
        let ad_html = liHTML.item(i);
        let advertisement = {};

        let par = ad_html.getElementsByTagName('p').item(0);
        let link = par.getElementsByTagName('a').item(0).getAttribute('href');
        let location = link.split('.')[0].split('//')[1];
        //let image = ad_html.getElementsByTagName("img");

        if (location !== 'newyork' && location !== 'philadelphia') {
            let title = par.getElementsByClassName('result-title').item(0).innerText;
            let datetime = ad_html.getElementsByTagName('time').item(0).getAttribute('datetime');
            let date = datetime.split(' ')[0].split('-');

            advertisement['title'] = title;
            advertisement['location'] = location;
            advertisement['link'] = link;
            advertisement['date'] = date;
            advertisement['display'] = false;
            advertisement['image'] = "";

            adList.push(advertisement);
            getAndProcessPage(('https://cors.io/?' + link), setImage, count_valid);


            count_valid += 1;

            if (count_valid >= 10) {
                return;
            }
        }

        count_total += 1;
    }

    /// print counts to the console
    console.log('[Total Listings Found]: ' + count_total);
    console.log('[Valid Listings Found]: ' + count_valid);
}

function setImage(response, i) {
    let ad = adList[i];
    let imageList = response.getElementsByTagName('img');
    if (imageList.length > 0) {
        let image = imageList.item(0).getAttribute('src');
        ad['image'] = image;
        vue.imageCount++;
    } else {
        ad['image'] = "none";
    }
}

export function populateImage(ad) {
    getAndProcessPage(('https://cors.io/?' + ad['link']), setImage, ad);
}

function getUrls(parameters) {
    let h = parameters;
    /*let model = parameters.model;
    let minYear = parameters.minYear;
    //var maxYear = parameters.maxYear;
    let minPrice = parameters.minPrice;
    let maxPrice = parameters.maxPrice;
    let minMiles = parameters.minMiles;
    let maxMiles = parameters.maxMiles;*/

    let model = 'bmw';
    let minYear = '2000';
    //var maxYear = parameters.maxYear;
    let minPrice = '5000';
    let maxPrice = '9500';
    let minMiles = '40000';
    let maxMiles = '90000';

    let corsPrefix = 'https://cors.io/?';

    // northern new jersey search link
    let urlNorth = corsPrefix + 'https://newjersey.craigslist.org/search/cto?auto_transmission=2&hasPic=1&min_price=' + minPrice
        + '&max_auto_miles=' + maxMiles + '&max_price=' + maxPrice + '&auto_make_model=' + model + '&min_auto_miles=' + minMiles
        + '&min_auto_year=' + minYear + '&auto_title_status=1';

    console.log(urlNorth);

    // map of search urls
    let urls = {
        nnj: urlNorth
    };

    return urls;
}

function getAndProcessPage(url, callback, par) {
    let anHttpRequest = new XMLHttpRequest();
    anHttpRequest.onreadystatechange = function() {
        if (anHttpRequest.readyState === 4 && anHttpRequest.status === 200) {
            let response = document.createElement('html');
            response.innerHTML = anHttpRequest.responseText;
            if (callback != null) {
                if (par != null) {
                    callback(response, par);
                } else {
                    callback(response);
                }
            }
        }
    };

    anHttpRequest.open('GET', url, true);
    anHttpRequest.send(null);
}

export function executeSearch(parameters) {
    let urls = getUrls(parameters);
    getAndProcessPage(urls.nnj, parseResponse, null);
}

export default {executeSearch, populateImage}
