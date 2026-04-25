import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';
import { query } from '../lib/db.js';

const COMPETITOR_DIR = 'D:/Alraheeq/11/copied1';

async function importData() {
  const sources = [
    {
      domain: 'alalamyaherbs.com',
      categories: [
        { path: 'herbs-leaves', slug: 'herbs' },
        { path: 'spices', slug: 'spices' },
        { path: 'seeds', slug: 'seeds' },
        { path: 'flowers', slug: 'flowers' },
      ],
      arPrefix: 'ar'
    },
    {
      domain: 'almasherbs.com',
      categories: [
        { path: 'herbs-infusions', slug: 'herbs' },
        { path: 'dehydrated-vegetables', slug: 'dehydrated' },
        { path: 'spices', slug: 'spices' },
        { path: 'seeds', slug: 'seeds' },
      ],
      arPrefix: 'ar'
    }
  ];

  for (const source of sources) {
    console.log(`--- Processing ${source.domain} ---`);
    for (const cat of source.categories) {
      const enCatPath = path.join(COMPETITOR_DIR, source.domain, cat.path, 'index.html');
      const arCatPath = path.join(COMPETITOR_DIR, source.domain, source.arPrefix, `${cat.path}-ar`, 'index.html');
      
      if (!fs.existsSync(enCatPath)) {
        console.warn(`EN path not found: ${enCatPath}`);
        continue;
      }

      const enHtml = fs.readFileSync(enCatPath, 'utf-8');
      const enDoc = new JSDOM(enHtml).window.document;
      const arDoc = fs.existsSync(arCatPath) ? new JSDOM(fs.readFileSync(arCatPath, 'utf-8')).window.document : null;

      const enItems = Array.from(enDoc.querySelectorAll('.e-loop-item'));
      const arItems = arDoc ? Array.from(arDoc.querySelectorAll('.e-loop-item')) : [];

      console.log(`Found ${enItems.length} items in ${cat.path}`);

      for (let i = 0; i < enItems.length; i++) {
        const enEl = enItems[i];
        const arEl = arItems[i];

        // The title is usually in an h5 or h2 or .elementor-heading-title
        const enTitleEl = enEl.querySelector('h5, h2, .elementor-heading-title');
        const arTitleEl = arEl ? arEl.querySelector('h5, h2, .elementor-heading-title') : null;
        const imgEl = enEl.querySelector('img');
        const linkEl = enEl.querySelector('a');

        if (!enTitleEl) continue;

        const enName = enTitleEl.textContent.trim();
        const arName = arTitleEl ? arTitleEl.textContent.trim() : enName;
        const slug = enName.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        const imageUrl = imgEl ? imgEl.getAttribute('src') : '';
        const detailHref = linkEl ? linkEl.getAttribute('href') : '';

        // Resolve absolute image URL
        let absoluteImageUrl = imageUrl;
        if (imageUrl && !imageUrl.startsWith('http')) {
          absoluteImageUrl = `https://${source.domain}/${imageUrl.replace(/\.\.\//g, '')}`;
        }

        // Try to load product detail page for specs
        let specs = {};
        let description = { en: `Premium quality ${enName} from Egypt.`, ar: `${arName} عالي الجودة من مصر.` };
        
        if (detailHref) {
           // Detail path relative to category page
           // Example: href="../products/basil/index.html" 
           // cat.path is "herbs-leaves"
           // So path.join(COMPETITOR_DIR, domain, "herbs-leaves", "../products/basil/index.html")
           // -> D:/.../domain/products/basil/index.html
           const resolvedDetailPath = path.resolve(path.join(COMPETITOR_DIR, source.domain, cat.path), detailHref);
           
           if (fs.existsSync(resolvedDetailPath)) {
             const detailHtml = fs.readFileSync(resolvedDetailPath, 'utf-8');
             const detailDoc = new JSDOM(detailHtml).window.document;
             
             // Extract description from meta or content
             const ogDesc = detailDoc.querySelector('meta[property="og:description"]')?.getAttribute('content');
             if (ogDesc) description.en = ogDesc;

             // Extract specs from table or list
             detailDoc.querySelectorAll('li, tr').forEach(el => {
               const text = el.textContent.trim();
               if (text.includes(':')) {
                 const [k, v] = text.split(':');
                 if (k && v && k.length < 50 && v.length < 200) {
                   specs[k.trim().toLowerCase().replace(/ /g, '_')] = v.trim();
                 }
               }
             });
           }
        }

        try {
          const catResult = await query('SELECT id FROM categories WHERE slug = $1', [cat.slug]);
          const categoryId = catResult.rows[0]?.id;
          if (!categoryId) {
             console.warn(`Category ${cat.slug} not found in DB`);
             continue;
          }

          await query(
            `INSERT INTO products (name, description, slug, category_id, image_url, images, specs, origin) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
             ON CONFLICT (slug) DO UPDATE SET 
               name = EXCLUDED.name, 
               description = EXCLUDED.description, 
               specs = EXCLUDED.specs,
               image_url = EXCLUDED.image_url,
               images = EXCLUDED.images`,
            [
              JSON.stringify({ en: enName, ar: arName }),
              JSON.stringify(description),
              slug,
              categoryId,
              absoluteImageUrl,
              absoluteImageUrl ? [absoluteImageUrl] : [],
              JSON.stringify(specs),
              'Egypt'
            ]
          );
          console.log(`✅ Upserted: ${enName}`);
        } catch (err) {
          console.error(`❌ Error upserting ${enName}:`, err.message);
        }
      }
    }
  }
  process.exit(0);
}

importData();
