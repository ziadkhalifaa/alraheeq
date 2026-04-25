import React from 'react';
import { useEditor } from '@/editor/EditorContext';
import { 
  GripVertical, Trash2, Copy, Eye, EyeOff, 
  ChevronDown, ChevronRight, Layers, Layout,
  Plus
} from 'lucide-react';
import { Reorder } from 'framer-motion';
import { Button } from '@/components/ui/button';

export default function LayersPanel() {
  const { pageContent, updateContent } = useEditor();
  const sections = pageContent.sections || [];

  const handleReorder = (newSections: any[]) => {
    updateContent('sections', newSections);
  };

  const deleteSection = (id: string) => {
    if (confirm('Delete this section?')) {
      updateContent('sections', sections.filter((s: any) => s.id !== id));
    }
  };

  const duplicateSection = (section: any) => {
    const newSection = { ...section, id: `section-${Date.now()}` };
    const index = sections.findIndex((s: any) => s.id === section.id);
    const newSections = [...sections];
    newSections.splice(index + 1, 0, newSection);
    updateContent('sections', newSections);
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200 w-80">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          <Layers size={18} className="text-brand-green" /> Layers
        </h3>
        <Badge variant="secondary" className="rounded-full">{sections.length}</Badge>
      </div>

      <div className="flex-grow overflow-auto p-2 custom-scrollbar">
        {sections.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-6">
            <Layout size={40} className="text-gray-100 mb-4" />
            <p className="text-xs text-gray-400 font-medium">No sections found. Add your first section to start building.</p>
          </div>
        ) : (
          <Reorder.Group axis="y" values={sections} onReorder={handleReorder} className="space-y-1">
            {sections.map((section: any) => (
              <Reorder.Item 
                key={section.id} 
                value={section}
                className="group flex items-center gap-2 p-2 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer border border-transparent hover:border-gray-100"
              >
                <div className="text-gray-300 group-hover:text-gray-400">
                  <GripVertical size={16} />
                </div>
                <div className="flex-grow">
                  <div className="text-xs font-bold text-gray-700 capitalize">{section.type.replace(/-/g, ' ')}</div>
                  <div className="text-[10px] text-gray-400 truncate max-w-[120px]">{section.id}</div>
                </div>
                <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                  <button onClick={() => duplicateSection(section)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Copy size={14} /></button>
                  <button onClick={() => deleteSection(section.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={14} /></button>
                </div>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        )}
      </div>

      <div className="p-4 border-t border-gray-100">
        <Button className="w-full bg-brand-green hover:bg-brand-green-dark gap-2 rounded-xl h-10 shadow-lg shadow-brand-green/10">
          <Plus size={16} /> Add Section
        </Button>
      </div>
    </div>
  );
}

import { Badge } from '@/components/ui/badge';
