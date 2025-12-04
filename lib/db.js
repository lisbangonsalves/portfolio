import clientPromise from './mongodb';

const DB_NAME = 'portfolio';

export async function getDatabase() {
  const client = await clientPromise;
  return client.db(DB_NAME);
}

// Portfolio Data functions
export async function getPortfolioData() {
  const db = await getDatabase();
  const portfolio = await db.collection('portfolio').findOne({ type: 'main' });

  if (!portfolio) {
    // Return default structure if no data exists
    return {
      skills: {},
      projects: [],
      experience: [],
      categoryMeta: {}
    };
  }

  // Remove MongoDB _id field from response
  const { _id, type, ...data } = portfolio;
  return data;
}

export async function updatePortfolioData(type, data) {
  const db = await getDatabase();
  const currentData = await getPortfolioData();

  // Update the specific section
  currentData[type] = data;

  // Upsert the portfolio document
  await db.collection('portfolio').updateOne(
    { type: 'main' },
    { $set: { ...currentData, type: 'main' } },
    { upsert: true }
  );

  return currentData;
}

export async function updateCategoryMeta(categoryMeta) {
  const db = await getDatabase();
  const currentData = await getPortfolioData();

  currentData.categoryMeta = categoryMeta;

  await db.collection('portfolio').updateOne(
    { type: 'main' },
    { $set: { categoryMeta, type: 'main' } },
    { upsert: true }
  );

  return currentData;
}

// Messages functions
export async function getMessages() {
  const db = await getDatabase();
  const messages = await db.collection('messages')
    .find({})
    .sort({ timestamp: -1 })
    .toArray();

  return messages;
}

export async function createMessage(messageData) {
  const db = await getDatabase();
  const newMessage = {
    ...messageData,
    timestamp: new Date().toISOString(),
    read: false,
    createdAt: new Date()
  };

  const result = await db.collection('messages').insertOne(newMessage);

  return {
    ...newMessage,
    id: newMessage._id.toString(),
    _id: undefined
  };
}

export async function deleteMessage(messageId) {
  const db = await getDatabase();
  await db.collection('messages').deleteOne({ _id: messageId });
  return true;
}

export async function toggleMessageRead(messageId) {
  const db = await getDatabase();
  const message = await db.collection('messages').findOne({ _id: messageId });

  if (!message) {
    return null;
  }

  const newReadStatus = !message.read;

  await db.collection('messages').updateOne(
    { _id: messageId },
    { $set: { read: newReadStatus } }
  );

  return newReadStatus;
}
