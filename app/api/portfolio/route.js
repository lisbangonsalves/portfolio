import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'app', 'data', 'portfolio-data.json');

function readData() {
  const fileContents = fs.readFileSync(DATA_FILE, 'utf8');
  return JSON.parse(fileContents);
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

export async function GET() {
  try {
    const data = readData();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { type, data: newData, categoryMeta } = await request.json();
    const currentData = readData();

    if (type === 'skills') {
      currentData.skills = newData;
      if (categoryMeta) {
        currentData.categoryMeta = categoryMeta;
      }
    } else if (type === 'projects') {
      currentData.projects = newData;
    } else if (type === 'experience') {
      currentData.experience = newData;
    }

    writeData(currentData);
    return NextResponse.json({ success: true, data: currentData });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update data' }, { status: 500 });
  }
}
