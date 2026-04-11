// Markdown 与 ResumeData 的双向转换
import type { ResumeData } from '../types/resume';

export function resumeToMarkdown(data: ResumeData): string {
  const { personalInfo, experience, education, skills, projects, languages } = data;
  
  let md = `# ${personalInfo.fullName || '姓名'}\n\n`;
  
  // 联系方式
  const contacts = [
    personalInfo.email,
    personalInfo.phone,
    personalInfo.location,
    personalInfo.linkedin,
    personalInfo.website,
  ].filter(Boolean);
  
  if (contacts.length > 0) {
    md += contacts.join(' | ') + '\n\n';
  }
  
  // 个人简介
  if (personalInfo.summary) {
    md += `## 个人简介\n\n${personalInfo.summary}\n\n`;
  }
  
  // 工作经验
  if (experience.length > 0) {
    md += `## 工作经验\n\n`;
    experience.forEach(exp => {
      md += `### ${exp.position}\n`;
      md += `**${exp.company}** | ${exp.startDate} - ${exp.current ? '至今' : exp.endDate}\n\n`;
      md += `${exp.description}\n\n`;
    });
  }
  
  // 教育背景
  if (education.length > 0) {
    md += `## 教育背景\n\n`;
    education.forEach(edu => {
      md += `### ${edu.degree}\n`;
      md += `**${edu.school}** | ${edu.field} | ${edu.startDate} - ${edu.current ? '至今' : edu.endDate}\n\n`;
    });
  }
  
  // 项目经历
  if (projects.length > 0) {
    md += `## 项目经历\n\n`;
    projects.forEach(proj => {
      md += `### ${proj.name}\n`;
      if (proj.link) md += `[${proj.link}](${proj.link})\n\n`;
      md += `${proj.description}\n\n`;
      if (proj.technologies.length > 0) {
        md += `技术栈: ${proj.technologies.join(', ')}\n\n`;
      }
    });
  }
  
  // 技能
  if (skills.length > 0) {
    md += `## 技能\n\n`;
    skills.forEach(skill => {
      md += `- **${skill.name}**: ${getLevelText(skill.level)}\n`;
    });
    md += '\n';
  }
  
  // 语言能力
  if (languages.length > 0) {
    md += `## 语言能力\n\n`;
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
      location: '',
    },
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
    
    // 解析标题 (姓名)
    if (line.startsWith('# ') && !line.startsWith('## ')) {
      result.personalInfo!.fullName = line.replace('# ', '').trim();
      continue;
    }
    
    // 解析联系方式
    if (line.includes('|') && !line.startsWith('#') && !line.startsWith('-') && !line.startsWith('*')) {
      const contacts = line.split('|').map(s => s.trim());
      contacts.forEach(contact => {
        if (contact.includes('@')) result.personalInfo!.email = contact;
        else if (/^1[3-9]\d{9}$/.test(contact) || contact.includes('+')) result.personalInfo!.phone = contact;
        else if (contact.includes('linkedin.com') || contact.includes('领英')) result.personalInfo!.linkedin = contact;
        else if (contact.includes('http')) result.personalInfo!.website = contact;
        else result.personalInfo!.location = contact;
      });
      continue;
    }
    
    // 解析章节标题
    if (line.startsWith('## ')) {
      currentSection = line.replace('## ', '').trim();
      currentItem = null;
      continue;
    }
    
    // 解析个人简介
    if (currentSection === '个人简介' || currentSection === 'Summary') {
      if (line && !line.startsWith('#')) {
        result.personalInfo!.summary = (result.personalInfo!.summary || '') + line + '\n';
      }
    }
    
    // 解析工作经验
    if (currentSection === '工作经验' || currentSection === 'Experience') {
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
          if (dates[1] && (dates[1].includes('至今') || dates[1].toLowerCase().includes('present'))) {
            currentItem.current = true;
          } else {
            currentItem.endDate = dates[1] || '';
          }
        }
      } else if (currentItem && line) {
        currentItem.description += line + '\n';
      }
    }
    
    // 解析教育背景
    if (currentSection === '教育背景' || currentSection === 'Education') {
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
          if (dates[1] && (dates[1].includes('至今') || dates[1].toLowerCase().includes('present'))) {
            currentItem.current = true;
          } else {
            currentItem.endDate = dates[1] || '';
          }
        }
      }
    }
    
    // 解析技能
    if (currentSection === '技能' || currentSection === 'Skills') {
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
    
    // 解析语言能力
    if (currentSection === '语言能力' || currentSection === 'Languages') {
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
  
  // 清理简介中的多余换行
  if (result.personalInfo?.summary) {
    result.personalInfo.summary = result.personalInfo.summary.trim();
  }
  
  // 清理描述中的多余换行
  result.experience?.forEach(exp => {
    exp.description = exp.description.trim();
  });
  
  return result;
}

function getLevelText(level: string): string {
  const map: Record<string, string> = {
    beginner: '入门',
    intermediate: '熟练',
    advanced: '精通',
    expert: '专家',
  };
  return map[level] || level;
}

function parseLevel(text: string): 'beginner' | 'intermediate' | 'advanced' | 'expert' {
  const map: Record<string, 'beginner' | 'intermediate' | 'advanced' | 'expert'> = {
    '入门': 'beginner',
    '熟练': 'intermediate',
    '精通': 'advanced',
    '专家': 'expert',
    'beginner': 'beginner',
    'intermediate': 'intermediate',
    'advanced': 'advanced',
    'expert': 'expert',
  };
  return map[text.toLowerCase()] || 'intermediate';
}
