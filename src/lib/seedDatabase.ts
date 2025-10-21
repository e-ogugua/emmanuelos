import { readFileSync } from 'fs';
import { parseAppsData } from './dataParser';
import { supabase } from './supabaseClient';

async function seedDatabase() {
  try {
    // Read the apps data file
    const appsText = readFileSync('./someOfmyapps.txt', 'utf-8');

    // Parse the data
    const appsData = parseAppsData(appsText);

    console.log(`Parsed ${appsData.length} apps from the file`);

    if (appsData.length === 0) {
      console.log('No valid apps found to insert');
      return;
    }

    // Insert data into Supabase
    const { data, error } = await supabase
      .from('apps')
      .insert(appsData)
      .select();

    if (error) {
      console.error('Error inserting apps data:', error);
      return;
    }

    console.log(`Successfully inserted ${data?.length || 0} apps into the database`);

    // Log the inserted data for verification
    data?.forEach((app, index) => {
      console.log(`${index + 1}. ${app.name} - ${app.category} (${app.status})`);
    });

  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

// Run the seeder if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

export { seedDatabase };
