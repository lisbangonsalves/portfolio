import { NextResponse } from 'next/server';
import { getPortfolioData, updatePortfolioData, updateCategoryMeta } from '@/lib/db';

export async function GET() {
  try {
    const data = await getPortfolioData();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to read data:', error);
    return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { type, data: newData, categoryMeta } = await request.json();

    let currentData;

    if (type === 'skills') {
      currentData = await updatePortfolioData('skills', newData);
      if (categoryMeta) {
        currentData = await updateCategoryMeta(categoryMeta);
      }
    } else if (type === 'projects') {
      currentData = await updatePortfolioData('projects', newData);
    } else if (type === 'experience') {
      currentData = await updatePortfolioData('experience', newData);
    } else if (type === 'about') {
      currentData = await updatePortfolioData('about', newData);
    } else if (type === 'education') {
      currentData = await updatePortfolioData('education', newData);
    } else if (type === 'certifications') {
      currentData = await updatePortfolioData('certifications', newData);
    } else if (type === 'researchPapers') {
      currentData = await updatePortfolioData('researchPapers', newData);
    } else if (type === 'extraCurricularActivities') {
      currentData = await updatePortfolioData('extraCurricularActivities', newData);
    } else if (type === 'blogs') {
      currentData = await updatePortfolioData('blogs', newData);
    } else {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: currentData });
  } catch (error) {
    console.error('Failed to update data:', error);
    return NextResponse.json({ error: 'Failed to update data' }, { status: 500 });
  }
}
