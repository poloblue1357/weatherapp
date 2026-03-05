const fs = require('fs')

const dropzones = JSON.parse(fs.readFileSync('dropzones.json', 'utf8'))
const updated = dropzones.map(dz => ({ ...dz, source: 'scraped' }))
fs.writeFileSync('dropzones_updated.json', JSON.stringify(updated, null, 2))
console.log(`Done! Updated ${updated.length} dropzones`)