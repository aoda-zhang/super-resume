// Bidirectional conversion between Markdown and ResumeData
import type { ResumeData } from '../types/resume';

export function resumeToMarkdown(data: ResumeData): string {
  const { personalInfo, summary, experience, education, skills, projects, languages } = data;
  
  let md = `# ${personalInfo.fullName || 'Name'}\n\n`;
  
  
  const contacts = [
    personalInfo.email,
    personalInfo.phone,
    personalInfo.address,
    personalInfo.linkedin,
    personalInfo.website,
  ].filter(Boolean);
  
  if (contacts.length > 0) {
    md += contacts.join(' | ') + '\n\n';
  }
  
  // PersonalDescription
  if (summary) {
    md += `## Summary\n\n${summary}\n\n`;
  }
  
  
  if (experience.length > 0) {
    md += `## Experience\n\n`;
    experience.forEach(exp => {
      md += `### ${exp.position}\n`;
      md += `**${exp.company}** | ${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}\n\n`;
      md += `${exp.description}\n\n`;
    });
  }
  
  
  if (education.length > 0) {
    md += `## Education\n\n`;
    education.forEach(edu => {
      md += `### ${edu.degree}\n`;
      md += `**${edu.school}** | ${edu.field} | ${edu.startDate} - ${edu.current ? 'Present' : edu.endDate}\n\n`;
    });
  }
  
  
  if (projects.length > 0) {
    md += `## Projects\n\n`;
    projects.forEach(proj => {
      md += `### ${proj.name}\n`;
      if (proj.link) md += `[${proj.link}](${proj.link})\n\n`;
      md += `${proj.description}\n\n`;
      if (proj.technologies.length > 0) {
        md += `Tech Stack: ${proj.technologies.join(', ')}\n\n`;
      }
    });
  }
  
  
  if (skills.length > 0) {
    md += `## Skills\n\n`;
    skills.forEach(skill => {
      md += `- **${skill.name}**: ${getLevelText(skill.level)}\n`;
    });
    md += '\n';
  }
  
  
  if (languages.length > 0) {
    md += `## Languages\n\n`;
    languages.forEach(lang => {
      md += `- ${lang.name}: ${lang.level}\n`;
    });
    md += '\n';
  }
  
  return md.trim();
}

export function markdownToResume(md: string): Partial<ResumeData> {
  const result: Partial<ResumeData> = {
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      address: '',
    },
    summary: '',
    experience: [],
    education: [],
    skills: [],
    projects: [],
    languages: [],
  };
  
  const lines = md.split('\n');
  let currentSection = '';
  let currentItem: any = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    
    if (line.startsWith('# ') && !line.startsWith('## ')) {
      result.personalInfo!.fullName = line.replace('# ', '').trim();
      continue;
    }
    
    
    if (line.includes('|') && !line.startsWith('#') && !line.startsWith('-') && !line.startsWith('*')) {
      const contacts = line.split('|').map(s => s.trim());
      contacts.forEach(contact => {
        if (contact.includes('@')) result.personalInfo!.email = contact;
        else if (/^1[3-9]\d{9}$/.test(contact) || contact.includes('+')) result.personalInfo!.phone = contact;
        else if (contact.includes('linkedin.com') || contact.includes('LinkedIn')) result.personalInfo!.linkedin = contact;
        else if (contact.includes('http')) result.personalInfo!.website = contact;
        else result.personalInfo!.address = contact;
      });
      continue;
    }
    
    
    if (line.startsWith('## ')) {
      currentSection = line.replace('## ', '').trim();
      currentItem = null;
      continue;
    }
    
    
    if (currentSection === 'PersonalDescription' || currentSection === 'Summary') {
      if (line && !line.startsWith('#')) {
        result.summary = (result.summary || '') + line + '\n';
      }
    }
    
    
    if (currentSection === 'WorkExperience' || currentSection === 'Experience') {
      if (line.startsWith('### ')) {
        currentItem = {
          id: crypto.randomUUID(),
          position: line.replace('### ', '').trim(),
          company: '',
          startDate: '',
          endDate: '',
          current: false,
          description: '',
        };
        result.experience!.push(currentItem);
      } else if (currentItem && line.startsWith('**') && line.includes('|')) {
        const match = line.match(/\*\*(.+?)\*\*\s*\|\s*(.+)/);
        if (match) {
          currentItem.company = match[1].trim();
          const dateStr = match[2].trim();
          const dates = dateStr.split('-').map(s => s.trim());
          currentItem.startDate = dates[0] || '';
          if (dates[1] && (dates[1].includes('Present') || dates[1].toLowerCase().includes('present'))) {
            currentItem.current = true;
          } else {
            currentItem.endDate = dates[1] || '';
          }
        }
      } else if (currentItem && line) {
        currentItem.description += line + '\n';
      }
    }
    
    
    if (currentSection === 'Education' || currentSection === 'Education') {
      if (line.startsWith('### ')) {
        currentItem = {
          id: crypto.randomUUID(),
          degree: line.replace('### ', '').trim(),
          school: '',
          field: '',
          startDate: '',
          endDate: '',
          current: false,
        };
        result.education!.push(currentItem);
      } else if (currentItem && line.startsWith('**') && line.includes('|')) {
        const parts = line.replace(/\*\*/g, '').split('|').map(s => s.trim());
        currentItem.school = parts[0] || '';
        currentItem.field = parts[1] || '';
        if (parts[2]) {
          const dates = parts[2].split('-').map(s => s.trim());
          currentItem.startDate = dates[0] || '';
          if (dates[1] && (dates[1].includes('Present') || dates[1].toLowerCase().includes('present'))) {
            currentItem.current = true;
          } else {
            currentItem.endDate = dates[1] || '';
          }
        }
      }
    }
    
    
    if (currentSection === 'Skills' || currentSection === 'Skills') {
      if (line.startsWith('- **')) {
        const match = line.match(/- \*\*(.+?)\*\*:\s*(.+)/);
        if (match) {
          result.skills!.push({
            id: crypto.randomUUID(),
            name: match[1].trim(),
            level: parseLevel(match[2].trim()),
          });
        }
      }
    }
    
    
    if (currentSection === 'Languages' || currentSection === 'Languages') {
      if (line.startsWith('- ')) {
        const match = line.match(/- (.+?):\s*(.+)/);
        if (match) {
          result.languages!.push({
            id: crypto.randomUUID(),
            name: match[1].trim(),
            level: match[2].trim(),
          });
        }
      }
    }
  }
  
  
  if (result.summary) {
    result.summary = result.summary.trim();
  }
  
  
  result.experience?.forEach(exp => {
    exp.description = exp.description.trim();
  });
  
  return result;
}

function getLevelText(level: string): string {
  const map: Record<string, string> = {
    beginner: 'Beginner',
    intermediate: 'Proficient',
    advanced: 'Expert',
    expert: 'Master',
  };
  return map[level] || level;
}

function parseLevel(text: string): 'beginner' | 'intermediate' | 'advanced' | 'expert' {
  const map: Record<string, 'beginner' | 'intermediate' | 'advanced' | 'expert'> = {
    'Beginner': 'beginner',
    'Proficient': 'intermediate',
    'Expert': 'advanced',
    'Master': 'expert',
    'beginner': 'beginner',
    'intermediate': 'intermediate',
    'advanced': 'advanced',
    'expert': 'expert',
  };
  return map[text.toLowerCase()] || 'intermediate';
}
