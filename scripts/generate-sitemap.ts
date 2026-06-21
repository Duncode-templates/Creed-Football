import * as fs from 'fs';
import * as path from 'path';
import { mockArticles } from '../src/footballData';

interface SitemapEntry {
  loc: string;
  lastmod: string;
  changefreq: string;
  priority: string;
}

async function generateSitemap() {
  const rootDir = process.cwd();
  const publicDir = path.join(rootDir, 'public');
  const sitemapPath = path.join(publicDir, 'sitemap.xml');

  console.log('Generating high-performance dynamic SEO sitemap...');

  const baseDomain = 'https://creed-football.netlify.app';
  
  // Track unique URLs using a Map of location to its full entry
  const entriesMap = new Map<string, SitemapEntry>();

  // Helper to add or update an entry (deduplication)
  const addOrUpdateEntry = (entry: SitemapEntry) => {
    // Normalize trailing slashes and hashes for comparison
    const key = entry.loc.trim().replace(/\/$/, "");
    if (entriesMap.has(key)) {
      // If already exists, keep the most recent lastmod date
      const existing = entriesMap.get(key)!;
      if (new Date(entry.lastmod) > new Date(existing.lastmod)) {
        existing.lastmod = entry.lastmod;
      }
    } else {
      entriesMap.set(key, { ...entry, loc: key });
    }
  };

  // 1. Recover existing sitemap data (historical retention) to satisfy "if it already exists, do not overwrite/do only news"
  if (fs.existsSync(sitemapPath)) {
    console.log('Reading previous sitemap.xml to preserve existing crawled URLs...');
    try {
      const existingContent = fs.readFileSync(sitemapPath, 'utf8');
      const urlBlocks = existingContent.match(/<url>[\s\S]*?<\/url>/g) || [];
      console.log(`Found ${urlBlocks.length} pre-existing entries in previous sitemap.xml`);
      
      for (const block of urlBlocks) {
        const locMatch = block.match(/<loc>(.*?)<\/loc>/);
        const lastmodMatch = block.match(/<lastmod>(.*?)<\/lastmod>/);
        const changefreqMatch = block.match(/<changefreq>(.*?)<\/changefreq>/);
        const priorityMatch = block.match(/<priority>(.*?)<\/priority>/);
        
        if (locMatch) {
          const loc = locMatch[1].trim();
          const lastmod = lastmodMatch ? lastmodMatch[1].trim() : new Date().toISOString().substring(0, 10);
          const changefreq = changefreqMatch ? changefreqMatch[1].trim() : 'weekly';
          const priority = priorityMatch ? priorityMatch[1].trim() : '0.7';
          
          addOrUpdateEntry({ loc, lastmod, changefreq, priority });
        }
      }
    } catch (e) {
      console.warn('Error reading or parsing existing sitemap.xml:', e);
    }
  }

  // 2. Add core static routes
  const staticRoutes = [
    { loc: `${baseDomain}/`, changefreq: 'daily', priority: '1.0' },
    { loc: `${baseDomain}/#/analysis`, changefreq: 'daily', priority: '0.8' },
    { loc: `${baseDomain}/#/transfers`, changefreq: 'daily', priority: '0.8' },
    { loc: `${baseDomain}/#/news`, changefreq: 'daily', priority: '0.8' },
    { loc: `${baseDomain}/#/clubs`, changefreq: 'daily', priority: '0.8' },
    { loc: `${baseDomain}/#/worldcup`, changefreq: 'daily', priority: '0.8' },
  ];

  staticRoutes.forEach(route => {
    addOrUpdateEntry({
      loc: route.loc,
      lastmod: new Date().toISOString().substring(0, 10),
      changefreq: route.changefreq,
      priority: route.priority
    });
  });

  // 3. Add standard static mock articles
  mockArticles.forEach(article => {
    addOrUpdateEntry({
      loc: `${baseDomain}/#/article/${article.id}`,
      lastmod: article.date || new Date().toISOString().substring(0, 10),
      changefreq: 'weekly',
      priority: '0.7'
    });
  });

  // 4. Dynamically crawl ALL Firestore articles with pagination support
  try {
    const configPath = path.join(rootDir, 'firebase-applet-config.json');
    if (fs.existsSync(configPath)) {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      const projectId = config.projectId;
      const dbId = config.firestoreDatabaseId || '(default)';
      const apiKey = config.apiKey;
      const collectionName = config.collectionName || 'articles';

      if (projectId && apiKey) {
        let nextPageToken: string | undefined = undefined;
        let totalFetched = 0;
        
        do {
          let firestoreUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/${dbId}/documents/${collectionName}?key=${apiKey}`;
          if (nextPageToken) {
            firestoreUrl += `&pageToken=${nextPageToken}`;
          }

          console.log(`Querying Firestore partition...`);
          const response = await fetch(firestoreUrl);
          
          if (response.ok) {
            const data: any = await response.json();
            if (data && data.documents && Array.isArray(data.documents)) {
              totalFetched += data.documents.length;
              data.documents.forEach((doc: any) => {
                // Extract document ID from final segment of path
                const nameParts = doc.name.split('/');
                const docId = nameParts[nameParts.length - 1];
                const loc = `${baseDomain}/#/article/${docId}`;

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

                // Add or update the list automatically keeping duplicates out
                addOrUpdateEntry({
                  loc,
                  lastmod: dateStr,
                  changefreq: 'weekly',
                  priority: '0.7'
                });
              });
            }
            nextPageToken = data.nextPageToken;
          } else {
            console.error(`Firestore response failed: ${response.status} - ${response.statusText}`);
            nextPageToken = undefined;
          }
        } while (nextPageToken);

        console.log(`Firestore crawling completed. Fetched a total of ${totalFetched} items.`);
      }
    } else {
      console.warn('Firebase configuration file was not found. Skipping live Firestore crawl.');
    }
  } catch (error) {
    console.warn('Could not query dynamic live articles from database (using existing and mock list):', error);
  }

  // 5. Generate high-performance optimized XML payload
  const sortedEntries = Array.from(entriesMap.values()).sort((a, b) => {
    // Sort priority desc, then loc asc
    const priorityDiff = parseFloat(b.priority) - parseFloat(a.priority);
    if (priorityDiff !== 0) return priorityDiff;
    return a.loc.localeCompare(b.loc);
  });

  const urlsXml = sortedEntries.map(entry => `    <url>
        <loc>${entry.loc}</loc>
        <lastmod>${entry.lastmod}</lastmod>
        <changefreq>${entry.changefreq}</changefreq>
        <priority>${entry.priority}</priority>
    </url>`).join('\n');

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urlsXml}
</urlset>`;

  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  fs.writeFileSync(sitemapPath, sitemapXml, 'utf8');
  console.log(`Success! Dynamically optimized sitemap.xml with ${sortedEntries.length} unique URLs written to: ${sitemapPath}`);
}

generateSitemap().catch(err => {
  console.error('Core sitemap generator execution failed:', err);
  process.exit(1);
});
