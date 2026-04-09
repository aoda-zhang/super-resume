import { useResumeStore } from '../../store/resumeStore';
import { useEffect, useCallback } from 'react';

export function MarkdownEditor() {
  const { markdownContent, updateMarkdown, syncFromMarkdown } = useResumeStore();

  // 防抖同步
  useEffect(() => {
    const timer = setTimeout(() => {
      syncFromMarkdown();
    }, 500);
    return () => clearTimeout(timer);
  }, [markdownContent, syncFromMarkdown]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateMarkdown(e.target.value);
  }, [updateMarkdown]);

  return (
    <div className="h-full flex flex-col bg-slate-50">
      <div className="px-4 py-3 bg-white border-b border-slate-200">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-700">Markdown 编辑</h2>
          <span className="text-xs text-slate-500">实时预览中</span>
        </div>
      </div>
      
      <div className="flex-1 p-4 overflow-auto">
        <textarea
          value={markdownContent}
          onChange={handleChange}
          className="w-full h-full min-h-[500px] p-4 font-mono text-sm bg-white border border-slate-200 rounded-lg resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder={`# 姓名

邮箱 | 电话 | 地址

## 个人简介

简要描述你的职业背景和优势...

## 工作经验

### 职位名称
**公司名称** | 2020-01 - 至今

工作描述...

## 教育背景

### 学位
**学校名称** | 专业 | 2016-09 - 2020-06

## 技能

- **技能名称**: 精通
- **技能名称**: 熟练

## 项目经历

### 项目名称
项目描述...

技术栈: React, TypeScript

## 语言能力

- 中文: 母语
- 英语: 流利`}
          spellCheck={false}
        />
      </div>
      
      <div className="px-4 py-2 bg-slate-100 border-t border-slate-200 text-xs text-slate-500">
        支持标准 Markdown 语法，修改后会自动同步到右侧预览
      </div>
    </div>
  );
}
