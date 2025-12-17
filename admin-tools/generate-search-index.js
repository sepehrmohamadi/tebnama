const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

// Function to parse frontmatter from markdown files
function parseFrontMatter(content) {
  const frontMatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n/;
  const match = content.match(frontMatterRegex);
  
  if (match) {
    const frontMatter = yaml.load(match[1]);
    const body = content.slice(match[0].length);
    return { frontMatter, body };
  }
  
  return null;
}

// Function to generate search index
function generateSearchIndex() {
  const postsDir = path.join(__dirname, '..', '_posts');
  const outputPath = path.join(__dirname, '..', 'assets', 'search.json');
  
  // Read all post files
  const postFiles = fs.readdirSync(postsDir);
  const searchData = [];
  
  for (const file of postFiles) {
    if (path.extname(file) === '.md') {
      const filePath = path.join(postsDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      const parsed = parseFrontMatter(content);
      
      if (parsed && parsed.frontMatter) {
        const postData = parsed.frontMatter;
        searchData.push({
          title: postData.title || '',
          title_en: (postData.company_slug || '').replace(/-/g, ' '),
          city: postData.city || '',
          url: `/${path.basename(file, '.md')}.html`,
          logo: postData.logo || '',
          cover: postData.cover || ''
        });
      }
    }
  }
  
  // Write to search.json
  fs.writeFileSync(outputPath, JSON.stringify(searchData, null, 2));
  console.log(`Generated search index with ${searchData.length} entries`);
}

// Run the function
generateSearchIndex();