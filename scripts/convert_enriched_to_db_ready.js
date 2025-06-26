const fs = require('fs');
const path = require('path');

// Paths
const enrichedPath = path.join(__dirname, '../StoryMapApi/Data/storymapdata_converted_enriched_v21.json');
const existingPath = path.join(__dirname, '../StoryMapApi/Data/storymapdata_db_ready.json');
const outputPath = path.join(__dirname, '../public/storymapdata_db_ready_v2.json');

function convertEnrichedToDbReady(enrichedData) {
  return enrichedData.map(item => {
    // Transform each item to match the db_ready structure
    const transformed = {
      Name: item.name || '',
      Title: item.title || '',
      Affiliation: item.affiliation || '',
      College: item.college || '',
      ProjectName: item.project?.title || '',
      ImageUrl: item.project?.image_url || '',
      ProfileImageUrl: item.project?.profile_image_url || '',
      Location: item.location || '',
      Latitude: item.latitude || 0,
      Longitude: item.longitude || 0,
      DescriptionShort: item.project?.description_short || '',
      DescriptionLong: item.project?.description || '',
      ProjectCategory: item.project?.category || '',
      HasArtwork: (item.artworks && item.artworks.length > 0) || false,
      HasPoems: (item.poems && item.poems.length > 0) || false,
      HasOutcomes: (item.outcomes && item.outcomes.length > 0) || false,
      Background: item.background?.bio || '',
      Department: '',
      Year: 0,
      
      // Transform artworks
      Artworks: (item.artworks || []).map(artwork => ({
        Title: artwork.title || '',
        Description: artwork.description || '',
        ImageUrl: artwork.image_url || '',
        ActivityTitle: artwork.activity_title || ''
      })),
      
      // Transform poems - include both Spanish and English versions
      Poems: (item.poems || []).map(poem => {
        const spanishText = poem.poema || '';
        const englishText = poem.poem || '';
        
        // Combine both versions in Content field
        let combinedContent = '';
        if (spanishText && englishText) {
          combinedContent = `${spanishText}\n\n---\n\n${englishText}`;
        } else if (spanishText) {
          combinedContent = spanishText;
        } else if (englishText) {
          combinedContent = englishText;
        }
        
        return {
          Title: poem.activity_title || 'Untitled',
          Content: combinedContent,
          Author: poem.description ? 'Anonymous' : '',
          Description: poem.description || '',
          // Keep individual versions for potential future use
          Poema: spanishText,
          Poem: englishText
        };
      }),
      
      // Transform outcomes to activities (since frontend expects Activities)
      Activities: (item.outcomes || []).map(outcome => ({
        Title: outcome.title || '',
        Description: outcome.summary || '',
        Date: '',
        Link: outcome.link || '',
        Type: outcome.type || ''
      })),
      
      // Keep the original outcome structure for backward compatibility
      Outcome: item.outcomes && item.outcomes.length > 0 ? {
        Type: item.outcomes[0].type || '',
        Title: item.outcomes[0].title || '',
        Link: item.outcomes[0].link || '',
        Summary: item.outcomes[0].summary || ''
      } : {
        Type: '',
        Title: '',
        Link: '',
        Summary: ''
      }
    };
    
    return transformed;
  });
}

function mergeData(enrichedData, existingData) {
  // Start with all existing data
  const mergedData = [...existingData];
  
  // Add or update with enriched data
  enrichedData.forEach(enrichedItem => {
    const existingIndex = mergedData.findIndex(item => item.Name === enrichedItem.name);
    const convertedItem = convertEnrichedToDbReady([enrichedItem])[0];
    
    if (existingIndex >= 0) {
      // Update existing entry with enriched data, but preserve existing good data
      const existingItem = mergedData[existingIndex];
      const updatedItem = { ...existingItem };
      
      // Only update fields if enriched data has meaningful content
      if (convertedItem.ImageUrl && convertedItem.ImageUrl.trim()) {
        updatedItem.ImageUrl = convertedItem.ImageUrl;
      }
      if (convertedItem.DescriptionShort && !convertedItem.DescriptionShort.includes('This is a short description')) {
        updatedItem.DescriptionShort = convertedItem.DescriptionShort;
      }
      if (convertedItem.DescriptionLong && !convertedItem.DescriptionLong.includes('Sed ut perspiciatis')) {
        updatedItem.DescriptionLong = convertedItem.DescriptionLong;
      }
      if (convertedItem.ProjectCategory && convertedItem.ProjectCategory.trim()) {
        updatedItem.ProjectCategory = convertedItem.ProjectCategory;
      }
      if (convertedItem.Location && convertedItem.Location.trim()) {
        updatedItem.Location = convertedItem.Location;
      }
      if (convertedItem.Latitude && convertedItem.Latitude !== 0) {
        updatedItem.Latitude = convertedItem.Latitude;
      }
      if (convertedItem.Longitude && convertedItem.Longitude !== 0) {
        updatedItem.Longitude = convertedItem.Longitude;
      }
      
      // Always use enriched data for these fields if they exist
      if (convertedItem.Artworks && convertedItem.Artworks.length > 0) {
        updatedItem.Artworks = convertedItem.Artworks;
        updatedItem.HasArtwork = true;
      }
      if (convertedItem.Poems && convertedItem.Poems.length > 0) {
        updatedItem.Poems = convertedItem.Poems;
        updatedItem.HasPoems = true;
      }
      if (convertedItem.Activities && convertedItem.Activities.length > 0) {
        updatedItem.Activities = convertedItem.Activities;
        updatedItem.HasOutcomes = true;
      }
      
      mergedData[existingIndex] = updatedItem;
      console.log(`Updated: ${enrichedItem.name}`);
    } else {
      // Add new entry from enriched data
      mergedData.push(convertedItem);
      console.log(`Added: ${enrichedItem.name}`);
    }
  });
  
  return mergedData;
}

function main() {
  try {
    console.log('Reading enriched data...');
    const enrichedData = JSON.parse(fs.readFileSync(enrichedPath, 'utf8'));
    console.log(`Found ${enrichedData.length} projects in enriched data`);
    
    console.log('Reading existing db_ready data...');
    const existingData = JSON.parse(fs.readFileSync(existingPath, 'utf8'));
    console.log(`Found ${existingData.length} projects in existing data`);
    
    console.log('Merging and converting data...');
    const mergedData = mergeData(enrichedData, existingData);
    
    console.log('Writing merged data...');
    fs.writeFileSync(outputPath, JSON.stringify(mergedData, null, 2));
    
    console.log(`✅ Successfully merged and converted ${mergedData.length} projects`);
    console.log(`📁 Output saved to: ${outputPath}`);
    
    // Show some stats
    const stats = {
      total: mergedData.length,
      fromEnriched: enrichedData.length,
      fromExisting: existingData.length,
      withArtworks: mergedData.filter(p => p.HasArtwork).length,
      withPoems: mergedData.filter(p => p.HasPoems).length,
      withOutcomes: mergedData.filter(p => p.HasOutcomes).length,
      categories: [...new Set(mergedData.map(p => p.ProjectCategory).filter(Boolean))]
    };
    
    // Count bilingual poems
    const totalPoems = mergedData.reduce((sum, p) => sum + (p.Poems?.length || 0), 0);
    const bilingualPoems = mergedData.reduce((sum, p) => {
      return sum + (p.Poems?.filter(poem => poem.Poema && poem.Poem).length || 0);
    }, 0);
    
    console.log('\n📊 Merge Stats:');
    console.log(`   Total projects: ${stats.total}`);
    console.log(`   From enriched data: ${stats.fromEnriched}`);
    console.log(`   From existing data: ${stats.fromExisting}`);
    console.log(`   With artworks: ${stats.withArtworks}`);
    console.log(`   With poems: ${stats.withPoems}`);
    console.log(`   Total poems: ${totalPoems}`);
    console.log(`   Bilingual poems: ${bilingualPoems}`);
    console.log(`   With outcomes: ${stats.withOutcomes}`);
    console.log(`   Categories: ${stats.categories.join(', ')}`);
    
  } catch (error) {
    console.error('❌ Error during conversion:', error.message);
    process.exit(1);
  }
}

// Run the conversion
main(); 