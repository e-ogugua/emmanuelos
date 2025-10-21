import { App } from './types';

export function parseAppsData(text: string): Omit<App, 'id' | 'created_at' | 'last_updated'>[] {
  const apps: Omit<App, 'id' | 'created_at' | 'last_updated'>[] = [];

  // Split by numbered sections
  const sections = text.split(/^(?=\d+\.)/gm);

  for (const section of sections) {
    if (!section.trim() || !section.match(/^\d+\./)) continue;

    try {
      const app = parseSingleApp(section.trim());
      if (app) {
        apps.push(app);
      }
    } catch (error) {
      console.error('Error parsing app section:', error);
    }
  }

  return apps;
}

function parseSingleApp(section: string): Omit<App, 'id' | 'created_at' | 'last_updated'> | null {
  const lines = section.split('\n').map(line => line.trim());

  let name = '';
  let description = '';
  let category = '';
  let status: 'Live' | 'Finalizing' | 'In Development' = 'In Development';
  let live_url = '';
  let github_url = '';
  let analytics_url = '';
  let image_url = '';
  let tags: string[] = [];
  let socials = {};

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith('Name:')) {
      name = line.replace('Name:', '').replace(/[""]/g, '').trim();
    } else if (line.startsWith('Description:')) {
      description = line.replace('Description:', '').trim();
    } else if (line.startsWith('Category:')) {
      category = line.replace('Category:', '').replace(/[""]/g, '').trim();
    } else if (line.startsWith('Current Status:') || line.startsWith('Status:')) {
      const statusText = line.replace(/Current Status:|Status:/, '').trim();
      if (statusText.includes('Production') || statusText.includes('Live')) {
        status = 'Live';
      } else if (statusText.includes('Finalizing')) {
        status = 'Finalizing';
      } else {
        status = 'In Development';
      }
    } else if (line.startsWith('Live URL:')) {
      live_url = line.replace('Live URL:', '').trim();
    } else if (line.startsWith('GitHub Repo:')) {
      github_url = line.replace('GitHub Repo:', '').trim();
    } else if (line.startsWith('Tags:')) {
      const tagsString = line.replace('Tags:', '').trim();
      tags = tagsString.split(',').map(tag => tag.replace(/[""]/g, '').trim()).filter(Boolean);
    } else if (line.startsWith('Social Handles:')) {
      // Parse social handles for email, phone, location
      const socialLine = line.replace('Social Handles:', '').trim();
      const emailMatch = socialLine.match(/Email:\s*([^,]+)/);
      const phoneMatch = socialLine.match(/Phone:\s*([^,]+)/);
      const locationMatch = socialLine.match(/Location:\s*([^,]+)/);

      socials = {
        email: emailMatch ? emailMatch[1].trim() : undefined,
        phone: phoneMatch ? phoneMatch[1].trim() : undefined,
        location: locationMatch ? locationMatch[1].trim() : undefined,
      };
    }
  }

  // Skip if required fields are missing
  if (!name || !description || !category) {
    return null;
  }

  return {
    name,
    description,
    category,
    status,
    live_url: live_url || undefined,
    github_url: github_url || undefined,
    analytics_url: analytics_url || undefined,
    image_url: image_url || undefined,
    tags,
    socials,
    traffic: Math.floor(Math.random() * 1000) + 100, // Random traffic for demo
  };
}
