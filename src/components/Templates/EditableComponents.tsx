import { useState, useRef, useEffect } from 'react';
import { useResumeStore } from '../../store/resumeStore';

export function EditableText({
  value,
  onChange,
  className = '',
  placeholder = '',
  multiline = false,
}: {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  multiline?: boolean;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    onChange(editValue);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      handleSave();
    } else if (e.key === 'Escape') {
      setEditValue(value);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    const InputComponent = multiline ? 'textarea' : 'input';
    return (
      <InputComponent
        ref={inputRef as any}
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={`${className} bg-indigo-50 border-2 border-indigo-400 rounded px-2 py-1 outline-none resize-none`}
        rows={multiline ? 3 : undefined}
      />
    );
  }

  return (
    <span
      onClick={() => setIsEditing(true)}
      className={`${className} cursor-text hover:bg-indigo-50 hover:px-2 hover:py-1 hover:rounded transition-all border-2 border-transparent hover:border-indigo-200`}
      title="点击编辑"
    >
      {value || placeholder}
    </span>
  );
}

export function EditableLabel({
  sectionType,
  defaultLabel,
  className = '',
  style,
}: {
  sectionType: string;
  defaultLabel: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const { sectionOrder, updateSectionLabel } = useResumeStore();
  const section = sectionOrder.find(s => s.type === sectionType);
  const label = section?.label || defaultLabel;
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(label);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEditValue(label);
  }, [label]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    updateSectionLabel(sectionType, editValue);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={(e) => e.key === 'Enter' && handleSave()}
        className={`${className} bg-indigo-50 border-2 border-indigo-400 rounded px-2 py-1 outline-none`}
        style={style}
      />
    );
  }

  return (
    <span
      onClick={() => setIsEditing(true)}
      className={`${className} cursor-text hover:bg-indigo-50 hover:px-2 hover:py-1 hover:rounded transition-all`}
      style={style}
      title="点击编辑标题"
    >
      {label}
    </span>
  );
}

// 使用 store 的 Hook 包装
export function useResumeEditing() {
  const store = useResumeStore();
  return {
    ...store,
    visibleSections: store.sectionOrder.filter(s => s.visible),
  };
}
