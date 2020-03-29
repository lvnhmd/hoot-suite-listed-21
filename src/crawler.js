/* eslint-disable arrow-parens */
/* eslint-disable implicit-arrow-linebreak */
const rp = require('request-promise');
const $ = require('cheerio');

exports.crawlCNTraveller = () => new Promise((resolve, reject) => {
  rp('https://www.cntraveller.com/topic/competitions')
    .then((html) => {
      const promises = Object.values($('ul > li > article > a', html))
        .filter((a) => a.name === 'a')
        .map((a) => rp(`https://www.cntraveller.com${a.attribs.href}`).then((doc) => {
          if ($("em:contains('closed')", doc).length) return null;

          return {
            url: `https://www.cntraveller.com${a.attribs.href}`,
            title: a.children[0].data,
            img: $('picture > img', doc)['0'].attribs['data-src'].replace(
              'crop/200',
              'crop/600',
            ),
            publisher: 'cntraveller',
          };
        }));

      Promise.all(promises).then((promos) => {
        resolve(promos.filter((p) => p !== null));
      });
    })
    .catch((err) => {
      reject(err);
    });
});

exports.crawlStylist = () => new Promise((resolve, reject) => {
  rp('https://www.stylist.co.uk/win/')
    .then((html) => {
      const promises = Object.values($('article > a', html))
        .filter((a) => a.name === 'a')
        .map((a) => rp(`https://www.stylist.co.uk${a.attribs.href}`).then((doc) => {
          const json = JSON.parse(new RegExp('([^>]*"@type":"Article"[^<]*)', 'i').exec(doc)[1]);

          return {
            url: json.url,
            title: json.headline,
            img: json.image.url,
            publisher: 'stylist',
          };
        }));

      Promise.all(promises).then((promos) => {
        resolve(promos.filter((p) => p !== null));
      });
    })
    .catch((err) => {
      reject(err);
    });
});

const extract = (html) => Object.values($('div.col-xs-12.col-sm-12.col-md-12 > a', html))
  .filter((a) => a.name === 'a').filter((thing, index, self) => index === self.findIndex((t) => (
    t.attribs.href === thing.attribs.href
  )))
  .map((a) => rp(`https://comps.goodhousekeeping.co.uk${a.attribs.href}`).then((doc) => {
    console.log('GET ', `https://comps.goodhousekeeping.co.uk${a.attribs.href}`.trim());
    const imgSelector = $('#main-comp-image', doc).length > 0 ? '#main-comp-image' : 'img';
    const promo = {
      url: `https://comps.goodhousekeeping.co.uk${a.attribs.href}`.trim(),
      title: $('h1', doc).text().trim(),
      img: $(imgSelector, doc)['0'].attribs.src,
      publisher: 'goodhousekeeping',
    };
    return promo;
  }).catch((err) => {
    console.log(`Failed to resolve GET https://comps.goodhousekeeping.co.uk${a.attribs.href}`);
    console.log(err);
  }));


const scrapePage = (url, promises) => new Promise((resolve, reject) => {
  rp(url)
    .then((html) => {
      // extract the last page number
      // eslint-disable-next-line max-len
      const last = 16;// parseInt($('li.last > a', html)['0'].attribs.href.match(/\d+/)[0].trim(), 10);
      const next = parseInt($('li.next > a', html)['0'].attribs.href.match(/\d+/)[0].trim(), 10);

      promises.push(...extract(html));
      // if (next <= last) {
      if (next < last) {
        // REMOVE NEXT LINE
        resolve(scrapePage(`https://comps.goodhousekeeping.co.uk/index/index/page/${next}.php`, promises));
      } else {
        console.log('promises to fulfil in total : ', promises.length);
        resolve(promises);
      }
    })
    .catch((err) => {
      reject(err);
    });
});

exports.crawlGoodHousekeeping = () =>
  new Promise(resolve =>
    scrapePage('https://comps.goodhousekeeping.co.uk/', []).then(promises =>
      Promise.all(promises).then(promos => {
        resolve(promos.filter(p => p !== null));
      })));


// #wrapper > div.container > div:nth-child(3) > div > div:nth-child(1)
// FINISH THIS METHOD
exports.crawlMarieClaire = () => new Promise((resolve) => scrapePage('https://comps.marieclaire.co.uk/', [])
  .then((promises) => Promise.all(promises).then((promos) => {
    resolve(promos.filter((p) => p !== null));
  })));

exports.crawlGrazia = () => new Promise((resolve) => scrapePage('https://winit.graziadaily.co.uk/', [])
  .then((promises) => Promise.all(promises).then((promos) => {
    resolve(promos.filter((p) => p !== null));
  })));
