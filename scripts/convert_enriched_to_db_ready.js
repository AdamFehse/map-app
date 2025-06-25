const fs = require('fs');
const path = require('path');

// Paths
const inputPath = path.join(__dirname, '../StoryMapApi/Data/storymapdata_converted_enriched_v21.json');
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

function main() {
  try {
    console.log('Reading enriched data...');
    const enrichedData = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
    
    console.log(`Found ${enrichedData.length} projects to convert`);
    
    console.log('Converting to db_ready format...');
    const dbReadyData = convertEnrichedToDbReady(enrichedData);
    
    console.log('Writing converted data...');
    fs.writeFileSync(outputPath, JSON.stringify(dbReadyData, null, 2));
    
    console.log(`✅ Successfully converted ${dbReadyData.length} projects`);
    console.log(`📁 Output saved to: ${outputPath}`);
    
    // Show some stats
    const stats = {
      total: dbReadyData.length,
      withArtworks: dbReadyData.filter(p => p.HasArtwork).length,
      withPoems: dbReadyData.filter(p => p.HasPoems).length,
      withOutcomes: dbReadyData.filter(p => p.HasOutcomes).length,
      categories: [...new Set(dbReadyData.map(p => p.ProjectCategory).filter(Boolean))]
    };
    
    // Count bilingual poems
    const totalPoems = dbReadyData.reduce((sum, p) => sum + (p.Poems?.length || 0), 0);
    const bilingualPoems = dbReadyData.reduce((sum, p) => {
      return sum + (p.Poems?.filter(poem => poem.Poema && poem.Poem).length || 0);
    }, 0);
    
    console.log('\n📊 Conversion Stats:');
    console.log(`   Total projects: ${stats.total}`);
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