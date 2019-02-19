import Vue from 'vue'
import App from './App.vue'

/* eslint-disable no-console */

Vue.config.productionTip = false;
let vue = new Vue({
    data: function() {
        return {
            advertisementList: [],
            pageState: 0
        }
    },
    render: ren => ren(App),
}).$mount('#app'); //el: '#app'

function parseResponse(strHTML) {
    let doc = document.createElement('html');
    doc.innerHTML = strHTML;

    let rowsHTML = doc.getElementsByClassName('rows');
    let liHTML = rowsHTML.item(0).getElementsByClassName('result-row');

    let count_total = 0;
    let count_valid = 0;

    // parses the listings titles and creates the advertisements
    for (let i = 0; i < liHTML.length; i++) {
        let ad_html = liHTML.item(i);
        let advertisement = {};

        let par = ad_html.getElementsByTagName('p').item(0);
        let title = par.getElementsByClassName('result-title').item(0).innerText;
        let datetime = ad_html.getElementsByTagName('time').item(0).getAttribute('datetime');
        let date = datetime.split(' ')[0].split('-');
        let link = par.getElementsByTagName('a').item(0).getAttribute('href');
        let location = link.split('.')[0].split('//')[1];
        //let image = ad_html.getElementsByTagName("img");

        if (location !== 'newyork' && location !== 'philadelphia') {
            advertisement['title'] = title;
            advertisement['location'] = location;
            advertisement['link'] = link;
            advertisement['date'] = date;
            advertisement['display'] = false;
            //advertisement['image'] = image;

            vue.advertisementList.push(advertisement);

            count_valid += 1;
        }

        count_total += 1;
    }

    /// print counts to the console
    console.log('[Total Listings Found]: ' + count_total);
    console.log('[Valid Listings Found]: ' + count_valid);
    console.log('=====================================');
    console.log(vue.advertisementList);
    vue.pageState = 2;
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

let HttpClient = function() {
    this.get = function(aUrl, aCallback) {
        let anHttpRequest = new XMLHttpRequest();
        anHttpRequest.onreadystatechange = function() {
            if (anHttpRequest.readyState === 4 && anHttpRequest.status === 200) {
                aCallback(anHttpRequest.responseText);
            }
        };

        anHttpRequest.open('GET', aUrl, true);
        anHttpRequest.send(null);
    }
};

export default function executeSearch(parameters) {
    vue.pageState = 1;
    let urls = getUrls(parameters);
    let client = new HttpClient();
    client.get(urls.nnj, function(response) {
        parseResponse(response);
    });
}
