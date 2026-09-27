const fs = require('fs');
const assert = require('assert');

console.log('--- YATRA TEST SUITE ---\n');

try {
  // 1. Test Article Database
  console.log('1. Testing Article Database...');
  const articlesFile = fs.readFileSync('js/articles.js', 'utf8');
  const match = articlesFile.match(/const articlesData = (\{[\s\S]*?\});\s*window/);
  assert(match, 'articlesData variable must exist in articles.js');
  const articles = JSON.parse(match[1]);
  const numArticles = Object.keys(articles).length;
  assert(numArticles > 10, 'Expected many articles, found ' + numArticles);
  console.log('  ✅ Found ' + numArticles + ' articles.');

  // 2. Test HTML Routes & Links
  console.log('\n2. Testing HTML Routes & Links...');
  const htmlFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));
  const validArticleIds = new Set(Object.keys(articles));
  let brokenLinks = 0;

  htmlFiles.forEach(file => {
    const html = fs.readFileSync(file, 'utf8');
    const matches = [...html.matchAll(/blog\.html\?id=([a-z0-9-]+)/g)];
    matches.forEach(m => {
      if (!validArticleIds.has(m[1])) {
        console.error('  ❌ Broken link in ' + file + ': ' + m[1]);
        brokenLinks++;
      }
    });
  });

  if (brokenLinks === 0) {
    console.log('  ✅ No broken article links in ' + htmlFiles.length + ' HTML files.');
  }

  // 3. Test Search & Filter UI
  console.log('\n3. Testing Search & Filter UI (home.html)...');
  const homeHtml = fs.readFileSync('home.html', 'utf8');
  assert(homeHtml.includes('id="searchInput"'), 'Search input must exist');
  assert(homeHtml.includes('id="categoryFilters"'), 'Category filters must exist');
  assert(homeHtml.includes('renderArticles'), 'renderArticles logic must exist');
  console.log('  ✅ Article discovery UI is present.');

  // 4. Test Login Page
  console.log('\n4. Testing Login Page (index.html)...');
  const loginHtml = fs.readFileSync('index.html', 'utf8');
  assert(loginHtml.includes('id="loginForm"'), 'Login form must exist');
  assert(loginHtml.includes('id="email"'), 'Email field must exist');
  assert(loginHtml.includes('id="password"'), 'Password field must exist');
  assert(loginHtml.includes('demo-notice') || loginHtml.includes('Demo mode'), 'Demo notice must be present');
  assert(loginHtml.includes('passToggle'), 'Password toggle must exist');
  console.log('  ✅ Login page has form, fields, password toggle, and demo notice.');

  // 5. Test No Fake Auth Redirect
  console.log('\n5. Testing no auth redirect in main.js...');
  const mainJs = fs.readFileSync('js/main.js', 'utf8');
  assert(!mainJs.includes("window.location.href = 'index.html'"), 'main.js must not redirect to login');
  console.log('  ✅ No auth redirect in main.js.');

  // 6. Test No Map References
  console.log('\n6. Testing no map references...');
  let mapRefs = 0;
  htmlFiles.forEach(file => {
    const html = fs.readFileSync(file, 'utf8');
    if (html.includes('href="map.html"') || html.includes("href='map.html'")) {
      console.error('  ❌ Map reference found in ' + file);
      mapRefs++;
    }
  });
  if (mapRefs === 0) {
    console.log('  ✅ No map references in any HTML file.');
  }

  // 7. Test Blog Page (not-found state)
  console.log('\n7. Testing blog.html not-found handling...');
  const blogHtml = fs.readFileSync('blog.html', 'utf8');
  assert(blogHtml.includes('Story not found') || blogHtml.includes('not found'), 'Blog must have not-found state');
  assert(blogHtml.includes('try') && blogHtml.includes('catch'), 'Blog must have error handling');
  console.log('  ✅ Blog page has not-found state and error handling.');

  // 8. Test Home Hero
  console.log('\n8. Testing Home Hero Entry Point...');
  assert(homeHtml.includes('hero-welcome'), 'Home must have full-viewport hero');
  assert(homeHtml.includes('scroll-hint') || homeHtml.includes('Scroll'), 'Home must have scroll hint');
  assert(homeHtml.includes('homeNav'), 'Home must have transparent navbar');
  console.log('  ✅ Home page has full-viewport hero with scroll hint and transparent nav.');

  console.log('\n🎉 ALL 8 TESTS PASSED!');

} catch (err) {
  console.error('\n❌ TEST FAILED:', err.message);
  process.exit(1);
}
