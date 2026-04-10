import { EditableText, EditableLabel, useResumeEditing } from './EditableComponents';

// 德国简历

export function GermanTemplate() {
  const { resumeData } = useResumeEditing();
  const { personalInfo, experience, education, projects } = resumeData;

  return (
    <div className="bg-white font-sans" data-resume-preview>
      {/* === 个人介绍部分 === */}
      <div className="p-8">
        <div className="flex justify-between items-start">
          {/* 左侧：姓名+职位+联系方式 */}
          <div className="flex-1">
            {/* 姓名 */}
            <h1 className="text-4xl font-bold text-slate-900 mb-1">
              <EditableText
                value={personalInfo.fullName}
                onChange={() => {}}
                placeholder="姓名"
              />
            </h1>
            
            {/* 职位 - 浅蓝色 */}
            <p className="text-lg text-sky-500 mb-4">
              <EditableText
                value={personalInfo.title}
                onChange={() => {}}
                placeholder="职位"
              />
            </p>

            {/* 联系方式 - label加粗，value正常 */}
            <div className="space-y-1 text-sm">
              {personalInfo.location && (
                <div>
                  <span className="font-bold text-slate-700">地址：</span>
                  <span className="text-slate-600">
                    <EditableText value={personalInfo.location} onChange={() => {}} placeholder="城市" />
                  </span>
                </div>
              )}
              {personalInfo.email && (
                <div>
                  <span className="font-bold text-slate-700">邮箱：</span>
                  <span className="text-slate-600">
                    <EditableText value={personalInfo.email} onChange={() => {}} placeholder="邮箱" />
                  </span>
                </div>
              )}
              {personalInfo.phone && (
                <div>
                  <span className="font-bold text-slate-700">电话：</span>
                  <span className="text-slate-600">
                    <EditableText value={personalInfo.phone} onChange={() => {}} placeholder="电话" />
                  </span>
                </div>
              )}
              {personalInfo.website && (
                <div>
                  <span className="font-bold text-slate-700">网站：</span>
                  <span className="text-slate-600">
                    <EditableText value={personalInfo.website} onChange={() => {}} placeholder="网站" />
                  </span>
                </div>
              )}
              {personalInfo.linkedin && (
                <div>
                  <span className="font-bold text-slate-700">LinkedIn：</span>
                  <span className="text-slate-600">
                    <EditableText value={personalInfo.linkedin} onChange={() => {}} placeholder="LinkedIn" />
                  </span>
                </div>
              )}
              {personalInfo.github && (
                <div>
                  <span className="font-bold text-slate-700">GitHub：</span>
                  <span className="text-slate-600">
                    <EditableText value={personalInfo.github} onChange={() => {}} placeholder="GitHub" />
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* 右侧：圆形头像 */}
          <div className="flex-shrink-0 ml-6">
            <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-slate-200">
              {personalInfo.photo ? (
                <img 
                  src={personalInfo.photo} 
                  alt="头像" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                  <span className="text-4xl text-slate-300">{personalInfo.fullName?.[0] || '?'}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 后续内容占位 */}
      <div className="px-8 pb-8">
        {/* 待添加其他部分 */}
      </div>
    </div>
  );
}
