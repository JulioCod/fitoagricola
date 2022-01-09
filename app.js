const puppeteer = require('puppeteer');
const baseurl = 'https://www.fitoagricola.net'
const url = 'https://www.fitoagricola.net/tienda-online';

module.exports.categories = async () => {
    let data = {url: url};
    const browser = await puppeteer.launch({ headless: false }); //poner true en produccion
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });
    await page.waitForSelector('#cookie_action_close_header_reject ');
    await page.click('#cookie_action_close_header_reject ');
    await page.waitForSelector('[id] > h3 > a');
    const scraped = await page.$$eval('[id] > h3 > a', a => a.map(a => {
        let data = {};
        data.url = a.getAttribute("href");
        data.category = a.innerHTML;
        data.subcategories = [];
        return data;
    }))
    await browser.close();
    for (let index = 0; index < scraped.length; index++) {
        scraped[index].url = baseurl + scraped[index].url;
        
    }
    data.categories = scraped;
    return data;
};

module.exports.subcategories = async (category) => {
    const browser = await puppeteer.launch({ headless: false }); //poner true en produccion
    const page = await browser.newPage();
    await page.goto(category.url, { waitUntil: 'networkidle2' });
    await page.waitForSelector('#cookie_action_close_header_reject ');
    await page.click('#cookie_action_close_header_reject ');
    await page.waitForSelector('[id] > h3 > a');
    const scraped = await page.$$eval('.category_list [id] > h3 > a', a => a.map(a => {
        let data = {};
        data.url = a.getAttribute("href");
        data.category = a.innerHTML;
        data.products = [];
        return data;
    }))
    await browser.close();
    for (let index = 0; index < scraped.length; index++) {
        scraped[index].url = baseurl + scraped[index].url;
        
    }
    category.subcategories = scraped;
    return category;
};

module.exports.products = async (subcategory) => {
    var scraped = [];
    const browser = await puppeteer.launch({ headless: false }); //poner true en produccion
    const page = await browser.newPage();
    await page.goto(subcategory.url, { waitUntil: 'networkidle2' });
    await page.waitForSelector('#cookie_action_close_header_reject ');
    await page.click('#cookie_action_close_header_reject ');
    await page.waitForSelector('#generic_products > ul > li');
    do {   
        scraped.push(await page.$$eval('#generic_products > ul > li', b => b.map(b => {
            let data = {};
            data.url = b.querySelector('h3 a').getAttribute("href");
            data.product = b.querySelector('h3 a').innerHTML;
            data.price = b.querySelector('.sales_price').innerHTML;
            return data;
        })))

        let nextpage = baseurl + await page.$eval('.pages > ul > li:last-child a', l => l.getAttribute("href"));
        await page.goto(nextpage, { waitUntil: 'networkidle2' });
    } while (await page.$eval('.pages > ul > li:last-child a', l => l.getAttribute("href")) != '') 
    
    
    await browser.close();
    for (let index = 0; index < scraped.length; index++) {
        scraped[index].url = baseurl + scraped[index].url;
        
    }
    subcategory.products = scraped;
    return subcategory;
};