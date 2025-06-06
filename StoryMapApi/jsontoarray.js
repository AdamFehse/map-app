import fs from 'fs/promises';

// Script to convert your current numbered JSON structure to a better array-based structure

function convertProjectData(oldProject) {
  const newProject = {
    // Copy basic properties
    Name: oldProject.Name,
    Title: oldProject.Title,
    Affiliation: oldProject.Affiliation,
    College: oldProject.College,
    Project: oldProject.Project,
    ImageUrl: oldProject.ImageUrl,
    Location: oldProject.Location,
    Latitude: oldProject.Latitude,
    Longitude: oldProject.Longitude,
    DescriptionShort: oldProject.DescriptionShort,
    DescriptionLong: oldProject.DescriptionLong,
    ProjectCategory: oldProject["Project Category"],
    HasArtwork: oldProject.HasArtwork === "TRUE",
    HasPoems: oldProject.HasPoems === "TRUE", 
    HasOutcomes: oldProject.HasOutcomes === "TRUE",
    
    // Convert outcome info to object
    Outcome: {
      Type: oldProject["Project Outcome"],
      Title: oldProject["Outcome Title"],
      Link: oldProject["Outcome Link"],
      Summary: oldProject["Outcome Summary"]
    },
    
    // Convert numbered artworks to array
    Artworks: [],
    
    // Convert numbered poems to array  
    Poems: [],
    
    // Extract unique activities
    Activities: []
  };
  
  // Extract artworks
  let index = 1;
  while (oldProject[`Artwork Title ${index}`]) {
    newProject.Artworks.push({
      ActivityTitle: oldProject[`Activity Title ${index}`] || '',
      Title: oldProject[`Artwork Title ${index}`],
      Description: oldProject[`Artwork Description ${index}`] || '',
      ImageUrl: oldProject[`Artwork ImageUrl ${index}`] || ''
    });
    index++;
  }
  
  // Extract poems
  index = 1;
  while (oldProject[`Poem ${index}`] || oldProject[`Activity Title Poem ${index}`]) {
    newProject.Poems.push({
      ActivityTitle: oldProject[`Activity Title Poem ${index}`] || '',
      Description: oldProject[`Poem Description ${index}`] || '',
      Content: oldProject[`Poem ${index}`] || '',
      ContentSpanish: oldProject[`Poema ${index}`] || ''
    });
    index++;
  }
  
  // Extract unique activities
  const activityTitles = new Set();
  
  // From artworks
  newProject.Artworks.forEach(artwork => {
    if (artwork.ActivityTitle) {
      activityTitles.add(artwork.ActivityTitle);
    }
  });
  
  // From poems
  newProject.Poems.forEach(poem => {
    if (poem.ActivityTitle) {
      activityTitles.add(poem.ActivityTitle);
    }
  });
  
  newProject.Activities = Array.from(activityTitles).map(title => ({
    Title: title,
    Type: "Workshop" // need to add more specific types
  }));
  
  return newProject;
}

// Function to convert entire dataset
function convertDataset(oldDataset) {
  return oldDataset.map(convertProjectData);
}

async function main() {
  try {
    // Read the input file
    const inputPath = './Data/storymapdata.json';
    console.log(`Reading file: ${inputPath}`);
    
    const fileContent = await fs.readFile(inputPath, 'utf8');
    const oldData = JSON.parse(fileContent);
    
    console.log(`Found ${oldData.length} projects to convert`);
    
    // Convert the data
    const newData = convertDataset(oldData);
    
    // Write the converted data to a new file
    const outputPath = './Data/storymapdata_converted.json';
    await fs.writeFile(outputPath, JSON.stringify(newData, null, 2));
    
    console.log(`Conversion complete! New file saved as: ${outputPath}`);
    
    // Log some statistics
    const stats = newData.reduce((acc, project) => {
      acc.totalArtworks += project.Artworks.length;
      acc.totalPoems += project.Poems.length;
      acc.totalActivities += project.Activities.length;
      return acc;
    }, { totalArtworks: 0, totalPoems: 0, totalActivities: 0 });
    
    console.log('\nConversion Statistics:');
    console.log(`- Projects: ${newData.length}`);
    console.log(`- Total Artworks: ${stats.totalArtworks}`);
    console.log(`- Total Poems: ${stats.totalPoems}`);
    console.log(`- Total Activities: ${stats.totalActivities}`);
    
  } catch (error) {
    console.error('Error during conversion:', error);
  }
}

// Run the conversion
main();