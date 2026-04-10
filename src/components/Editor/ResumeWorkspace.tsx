import { useResumeStore } from '../../store/resumeStore';
import { ModernTemplate } from '../Templates/ModernTemplate';
import { ClassicTemplate } from '../Templates/ClassicTemplate';
import { MinimalTemplate } from '../Templates/MinimalTemplate';
import { GermanTemplate } from '../Templates/GermanTemplate';
import { SectionEditor } from './SectionEditor';
import { FileImage, FileText, Globe } from 'lucide-react';
import { exportToPDF } from '../../utils/exportPdf';
import { exportToImage } from '../../utils/exportImage';
import { translations, type Language, type I18n } from '../../i18n';
import { useState } from 'react';

const templates = [
  { id: 'modern' as const, nameKey: 'modern' },
  { id: 'classic' as const, nameKey: 'classic' },
  { id: 'minimal' as const, nameKey: 'minimal' },
  { id: 'german' as const, nameKey: 'german' },
];

const languages: { code: Language; name: string; flag: string }[] = [
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
];

export function ResumeWorkspace() {
  const {
    template,
    setTemplate,
    language,
    setLanguage,
    fillSampleData,
    clearData,
  } = useResumeStore();

  const [showLangDropdown, setShowLangDropdown] = useState(false);

  const t = translations[language] as I18n;

  const handleExportPDF = async () => {
    const element = document.querySelector('[data-resume-preview]');
    if (element) {
      await exportToPDF(element as HTMLElement);
    }
  };

  const handleExportImage = async () => {
    const element = document.querySelector('[data-resume-preview]');
    if (element) {
      await exportToImage(element as HTMLElement);
    }
  };

  const currentLang = languages.find(l => l.code === language);

  return (
    <div className="h-screen flex bg-slate-100">
      {/* 左侧面板 - 编辑器 */}
      <div className="w-[420px] flex-shrink-0 h-full flex flex-col bg-white border-r border-slate-200">
        {/* 顶部工具栏 */}
        <div className="px-4 py-3 border-b border-slate-200">
          <div className="flex items-center justify-between mb-3">
            {/* 语言选择器 */}
            <div className="relative">
              <button
                onClick={() => setShowLangDropdown(!showLangDropdown)}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <Globe className="w-4 h-4" />
                <span>{currentLang?.flag} {currentLang?.name}</span>
              </button>
              {showLangDropdown && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setShowLangDropdown(false);
                      }}
                      className={`w-full px-4 py-2 text-sm text-left hover:bg-slate-100 flex items-center gap-2 ${
                        language === lang.code ? 'bg-indigo-50 text-indigo-600' : 'text-slate-700'
                      }`}
                    >
                      {lang.flag} {lang.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 示例数据按钮 */}
            <div className="flex gap-2">
              <button
                onClick={fillSampleData}
                className="px-3 py-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              >
                {t.header.fillSample}
              </button>
              <button
                onClick={clearData}
                className="px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                {t.header.clear}
              </button>
            </div>
          </div>
        </div>

        {/* 编辑器内容 - 新组件 */}
        <SectionEditor />

        {/* 导出按钮 */}
        <div className="p-4 border-t border-slate-200 bg-slate-50">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleExportPDF}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <FileText className="w-4 h-4" />
              {t.header.exportPdf}
            </button>
            <button
              onClick={handleExportImage}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-300 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
            >
              <FileImage className="w-4 h-4" />
              {t.header.exportImage}
            </button>
          </div>
        </div>
      </div>

      {/* 右侧面板 - 预览 */}
      <div className="flex-1 h-full flex flex-col">
        {/* 模板选择器 */}
        <div className="px-6 py-3 bg-white border-b border-slate-200">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-slate-700">{t.header.template}:</span>
            <div className="flex gap-2">
              {templates.map((tpl) => (
                <button
                  key={tpl.id}
                  onClick={() => setTemplate(tpl.id)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                    template === tpl.id
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {t.template[tpl.nameKey as keyof I18n['template']] as string}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 预览区域 */}
        <div className="flex-1 overflow-auto p-8 bg-slate-200">
          <div className="mx-auto bg-white shadow-lg" style={{ width: '210mm', minHeight: '297mm' }} data-resume-preview>
            {template === 'modern' && <ModernTemplate />}
            {template === 'classic' && <ClassicTemplate />}
            {template === 'minimal' && <MinimalTemplate />}
            {template === 'german' && <GermanTemplate />}
          </div>
        </div>
      </div>
    </div>
  );
}
