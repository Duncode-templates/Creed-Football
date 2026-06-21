import * as fs from 'fs';
import * as path from 'path';
import { mockArticles } from '../src/footballData';

// Fetch dynamic sitemap parameters
async function generateSitemap() {
  const rootDir = process.cwd();
  const publicDir = path.join(rootDir, 'public');
  const sitemapPath = path.join(publicDir, 'sitemap.xml');

  console.log('Generating dynamic SEO sitemap...');

  const baseDomain = 'https://creed-football.netlify.app';
  const urls: string[] = [];

  // 1. Add core static routes
  const staticRoutes = [
    { loc: `${baseDomain}/`, changefreq: 'daily', priority: '1.0' },
    { loc: `${baseDomain}/#/analysis`, changefreq: 'daily', priority: '0.8' },
    { loc: `${baseDomain}/#/transfers`, changefreq: 'daily', priority: '0.8' },
    { loc: `${baseDomain}/#/news`, changefreq: 'daily', priority: '0.8' },
    { loc: `${baseDomain}/#/clubs`, changefreq: 'daily', priority: '0.8' },
    { loc: `${baseDomain}/#/worldcup`, changefreq: 'daily', priority: '0.8' },
  ];

  staticRoutes.forEach(route => {
    urls.push(`    <url>
        <loc>${route.loc}</loc>
        <lastmod>${new Date().toISOString().substring(0, 10)}</lastmod>
        <changefreq>${route.changefreq}</changefreq>
        <priority>${route.priority}</priority>
    </url>`);
  });

  // 2. Add standard static mock articles
  mockArticles.forEach(article => {
    urls.push(`    <url>
        <loc>${baseDomain}/#/article/${article.id}</loc>
        <lastmod>${article.date || new Date().toISOString().substring(0, 10)}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.7</priority>
    </url>`);
  });

  // 3. Try fetching dynamic live articles from Firestore database
  try {
    const configPath = path.join(rootDir, 'firebase-applet-config.json');
    if (fs.existsSync(configPath)) {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      const projectId = config.projectId;
      const dbId = config.firestoreDatabaseId || '(default)';
      const apiKey = config.apiKey;
      const collectionName = config.collectionName || 'articles';

      if (projectId) {
        const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/${dbId}/documents/${collectionName}?key=${apiKey}`;
        console.log(`Fetching dynamic live articles from Firestore: ${firestoreUrl}`);

        const response = await fetch(firestoreUrl);
        if (response.ok) {
          const data: any = await response.json();
          if (data && data.documents && Array.isArray(data.documents)) {
            console.log(`Found ${data.documents.length} live articles in database. Adding to sitemap...`);
            data.documents.forEach((doc: any) => {
              // Extract the document ID which is the last part of doc.name
              const nameParts = doc.name.split('/');
              const docId = nameParts[nameParts.length - 1];

              // Extract published date if we can finding fields.date or publishedAt or similar
              let dateStr = new Date().toISOString().substring(0, 10);
              const fields = doc.fields || {};
              const rawDate = fields.date?.stringValue || fields.publishedAt?.stringValue || fields.scrapedAt?.stringValue;
              if (rawDate) {
                try {
                  const d = new Date(rawDate);
                  if (!isNaN(d.getTime())) {
                    dateStr = d.toISOString().substring(0, 10);
                  }
                } catch (e) {}
              }

              urls.push(`    <url>
        <loc>${baseDomain}/#/article/${docId}</loc>
        <lastmod>${dateStr}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.7</priority>
    </url>`);
            });
          } else {
            console.log('No documents found in the database articles collection.');
          }
        } else {
          console.warn(`Firestore sitemap fetch status not OK: ${response.status} - ${response.statusText}`);
        }
      }
    }
  } catch (error) {
    console.warn('Could not fetch live articles for sitemap (using mock articles only):', error);
  }

  // 4. Generate sitemap file contents
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urls.join('\n')}
</urlset>`;

  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  fs.writeFileSync(sitemapPath, sitemapXml, 'utf8');
  console.log(`Successfully generated dynamic sitemap at: ${sitemapPath}`);
}

generateSitemap().catch(err => {
  console.error('Error generating sitemap:', err);
  process.exit(1);
});
