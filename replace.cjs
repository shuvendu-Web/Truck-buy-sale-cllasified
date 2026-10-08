const fs = require('fs');
const path = require('path');

const replacements = [
  // Imports and React tags
  { regex: /import \{([^}]*)\bCar\b([^}]*)\} from 'lucide-react'/g, replacement: "import {$1Truck$2} from 'lucide-react'" },
  { regex: /<Car\b/g, replacement: "<Truck" },
  { regex: /Icons\.Car/g, replacement: "Icons.Truck" },
  { regex: /icon: 'Car'/g, replacement: "icon: 'Truck'" },
  { regex: /icon: 'Bike'/g, replacement: "icon: 'Truck'" },
  { regex: /icon: 'Shield'/g, replacement: "icon: 'Truck'" },
  { regex: /icon \|| 'Car'/g, replacement: "icon || 'Truck'" },
  { regex: /setIcon\('Car'\)/g, replacement: "setIcon('Truck')" },

  // General text
  { regex: /\bCar\b/g, replacement: 'Dump Truck' },
  { regex: /\bCars\b/g, replacement: 'Dump Trucks' },
  { regex: /\bcar\b/g, replacement: 'dump truck' },
  { regex: /\bcars\b/g, replacement: 'dump trucks' },
  
  { regex: /\bBike\b/g, replacement: 'Tractor Trailer' },
  { regex: /\bBikes\b/g, replacement: 'Tractor Trailers' },
  { regex: /\bbike\b/g, replacement: 'tractor trailer' },
  { regex: /\bbikes\b/g, replacement: 'tractor trailers' },
  
  { regex: /\bSUV\b/g, replacement: 'Flatbed Truck' },
  { regex: /\bSUVs\b/g, replacement: 'Flatbed Trucks' },
  { regex: /\bsuv\b/g, replacement: 'flatbed truck' },
  { regex: /\bsuvs\b/g, replacement: 'flatbed trucks' },
];

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let newContent = content;
      
      for (const r of replacements) {
        newContent = newContent.replace(r.regex, r.replacement);
      }
      
      if (newContent !== content) {
        fs.writeFileSync(fullPath, newContent);
        console.log('Updated', fullPath);
      }
    }
  }
}

processDir(path.join(__dirname, 'src'));
