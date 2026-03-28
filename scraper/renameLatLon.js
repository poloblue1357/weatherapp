const fs = require('fs');

// 1. Read the original JSON file
const rawData = fs.readFileSync('dropzones_v2.json', 'utf-8');
const dropzones = JSON.parse(rawData);

// 2. Transform each object
const updatedDropzones = dropzones.map(dz => {
    return {
        ...dz,
        lat: dz.latitude,
        lon: dz.longitude,
    // optionally remove the old keys
        latitude: undefined,
        longitude: undefined
    };
});

// 3. Write the transformed array to a new file
fs.writeFileSync('dropzones_v3.json', JSON.stringify(updatedDropzones, null, 2), 'utf-8');

console.log('Finished! Created dropzones_renamed.json');

