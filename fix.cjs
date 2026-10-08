const fs = require('fs');
const path = require('path');

function replaceInFile(filePath, search, replacement) {
  let content = fs.readFileSync(filePath, 'utf8');
  let newContent = content.split(search).join(replacement);
  if (newContent !== content) {
    fs.writeFileSync(filePath, newContent);
    console.log('Fixed', filePath);
  }
}

replaceInFile(path.join(__dirname, 'src/pages/admin/AdminDashboardPage.tsx'), "category ===icon || 'Truck'", "category === 'Dump Truck'");
replaceInFile(path.join(__dirname, 'src/pages/admin/AdminCategoriesPage.tsx'), "setIcon(cat.icon || 'Truck'|icon || 'Truck')", "setIcon(cat.icon || 'Truck')");

const seedDataPath = path.join(__dirname, 'src/data/seedData.ts');
let seedContent = fs.readFileSync(seedDataPath, 'utf8');
seedContent = seedContent.split("name:icon || 'Truck',").join("name: 'Dump Truck',");
seedContent = seedContent.split("category:icon || 'Truck',").join("category: 'Dump Truck',");
seedContent = seedContent.split("categoryName:icon || 'Truck',").join("categoryName: 'Dump Truck',");
fs.writeFileSync(seedDataPath, seedContent);
console.log('Fixed seedData.ts');
