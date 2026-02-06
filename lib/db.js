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
      categoryMeta: {},
      about: {
        content: `I'm an AI/ML Full-Stack Developer specializing in building intelligent systems that bridge the gap between artificial intelligence and scalable web applications. I combine deep learning expertise with full-stack development to create innovative solutions that solve complex real-world problems.

My technical expertise spans across machine learning frameworks (TensorFlow, PyTorch), modern web technologies (React, Next.js, Node.js), and cloud platforms. I architect end-to-end solutions that seamlessly integrate AI models into production-ready applications, ensuring scalability, performance, and exceptional user experiences.

From designing neural networks and training custom models to building robust APIs and intuitive frontends, I handle the complete development lifecycle. I'm passionate about leveraging AI/ML to create transformative products that make a meaningful impact.

When I'm not developing AI-powered applications, you'll find me researching the latest advancements in machine learning, experimenting with new frameworks, and contributing to the AI/ML community.`
      },
      education: [],
      certifications: [],
      researchPapers: [],
      extraCurricularActivities: [],
      resume: null
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
