const rp = require('request-promise');
const $ = require('cheerio');

exports.crawl = () => new Promise((resolve, reject) => {
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
