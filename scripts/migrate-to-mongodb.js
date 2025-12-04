// Migration script to transfer data from JSON file to MongoDB
// Run this with: node scripts/migrate-to-mongodb.js

const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const DATA_FILE = path.join(__dirname, '..', 'app', 'data', 'portfolio-data.json');
const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = 'portfolio';

async function migrate() {
  if (!MONGODB_URI) {
    console.error('❌ Error: MONGODB_URI not found in environment variables');
    console.error('Please add MONGODB_URI to your .env.local file');
    process.exit(1);
  }

  console.log('🚀 Starting migration...\n');

  // Read the JSON file
  let jsonData;
  try {
    const fileContents = fs.readFileSync(DATA_FILE, 'utf8');
    jsonData = JSON.parse(fileContents);
    console.log('✅ Successfully read portfolio-data.json');
  } catch (error) {
    console.error('❌ Error reading portfolio-data.json:', error.message);
    process.exit(1);
  }

  // Connect to MongoDB
  let client;
  try {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error.message);
    process.exit(1);
  }

  const db = client.db(DB_NAME);

  try {
    // Migrate portfolio data (skills, projects, experience, categoryMeta)
    console.log('\n📦 Migrating portfolio data...');
    const portfolioData = {
      type: 'main',
      skills: jsonData.skills || {},
      projects: jsonData.projects || [],
      experience: jsonData.experience || [],
      categoryMeta: jsonData.categoryMeta || {}
    };

    await db.collection('portfolio').updateOne(
      { type: 'main' },
      { $set: portfolioData },
      { upsert: true }
    );
    console.log('✅ Portfolio data migrated');
    console.log(`   - Skills: ${Object.keys(portfolioData.skills).length} categories`);
    console.log(`   - Projects: ${portfolioData.projects.length} items`);
    console.log(`   - Experience: ${portfolioData.experience.length} items`);

    // Migrate messages
    console.log('\n📧 Migrating messages...');
    const messages = jsonData.messages || [];

    if (messages.length > 0) {
      // Clear existing messages
      await db.collection('messages').deleteMany({});

      // Convert message IDs to MongoDB format
      const formattedMessages = messages.map(msg => {
        const { id, ...rest } = msg;
        return {
          ...rest,
          createdAt: new Date(msg.timestamp)
        };
      });

      await db.collection('messages').insertMany(formattedMessages);
      console.log(`✅ Migrated ${messages.length} messages`);
    } else {
      console.log('ℹ️  No messages to migrate');
    }

    console.log('\n🎉 Migration completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('1. Make sure your .env.local has all required environment variables');
    console.log('2. Test your application locally');
    console.log('3. Add environment variables to Vercel');
    console.log('4. Deploy to Vercel');

  } catch (error) {
    console.error('❌ Error during migration:', error.message);
    process.exit(1);
  } finally {
    await client.close();
    console.log('\n✅ MongoDB connection closed');
  }
}

// Run migration
migrate().catch(console.error);
