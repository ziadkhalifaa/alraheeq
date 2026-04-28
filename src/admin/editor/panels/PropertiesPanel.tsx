import React from 'react';
import { useEditor } from '@/editor/EditorContext';
import { 
  Settings, Paintbrush, Layout, Type, 
  ChevronDown, ArrowUpRight, Palette, Maximize
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

export default function PropertiesPanel() {
  const { pageContent, updateContent, selectedId } = useEditor();
  
  const rawSections = pageContent.sections;
  const sections: any[] = Array.isArray(rawSections) ? rawSections : [];
  const selectedSection = sections.find((s: any) => s.id === selectedId);

  if (!selectedId) {
    return (
      <div className="flex flex-col h-full bg-white border-l border-gray-200 w-80">
        <div className="p-4 border-b border-gray-100 flex items-center gap-2 bg-gray-50/50">
          <Settings size={18} className="text-gray-400" />
          <h3 className="font-bold text-gray-900">Properties</h3>
        </div>
        <div className="flex-grow flex flex-col items-center justify-center py-20 text-center px-8">
          <div className="w-16 h-16 rounded-3xl bg-gray-50 flex items-center justify-center text-gray-200 mb-6 border border-gray-100">
            <ArrowUpRight size={32} />
          </div>
          <h4 className="text-gray-900 font-bold mb-2">No Element Selected</h4>
          <p className="text-xs text-gray-400 leading-relaxed">Select a section on the canvas to edit its properties, styles, and settings.</p>
        </div>
      </div>
    );
  }

  const updateSectionSettings = (settings: any) => {
    const newSections = sections.map((s: any) => 
      s.id === selectedId ? { ...s, settings: { ...s.settings, ...settings } } : s
    );
    updateContent('sections', newSections);
  };

  return (
    <div className="flex flex-col h-full bg-white border-l border-gray-200 w-80 overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex items-center gap-2 bg-gray-50/50">
        <Settings size={18} className="text-brand-green" />
        <h3 className="font-bold text-gray-900 truncate">Settings: {selectedSection?.type}</h3>
      </div>

      <div className="flex-grow overflow-auto p-6 space-y-8 custom-scrollbar pb-20">
        {/* Layout Settings */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-[10px] font-extrabold text-gray-300 uppercase tracking-widest mb-4">
            <Layout size={12} /> Layout
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-gray-500">Vertical Spacing</Label>
              <Select 
                value={selectedSection?.settings?.padding || 'medium'} 
                onValueChange={(val) => updateSectionSettings({ padding: val })}
              >
                <SelectTrigger className="rounded-xl border-gray-100 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-xs font-bold text-gray-500">Full Width</Label>
              <Switch 
                checked={selectedSection?.settings?.fullWidth || false}
                onCheckedChange={(val) => updateSectionSettings({ fullWidth: val })}
              />
            </div>
          </div>
        </div>

        {/* Style Settings */}
        <div className="space-y-4 pt-4 border-t border-gray-50">
          <div className="flex items-center gap-2 text-[10px] font-extrabold text-gray-300 uppercase tracking-widest mb-4">
            <Paintbrush size={12} /> Appearance
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-gray-500">Background Style</Label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'white', bg: 'bg-white' },
                  { id: 'gray', bg: 'bg-gray-50' },
                  { id: 'green', bg: 'bg-brand-green' },
                  { id: 'gradient', bg: 'bg-brand-gradient' },
                ].map((style) => (
                  <button 
                    key={style.id}
                    onClick={() => updateSectionSettings({ bg: style.id })}
                    className={`aspect-square rounded-lg border-2 transition-all ${style.bg} ${selectedSection?.settings?.bg === style.id ? 'border-brand-gold scale-110 shadow-md' : 'border-transparent hover:border-gray-200'}`}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-gray-500">Background Overlay (%)</Label>
              <Slider 
                defaultValue={[selectedSection?.settings?.overlay || 0]} 
                max={100} 
                step={1}
                onValueChange={(val) => updateSectionSettings({ overlay: val[0] })}
              />
            </div>
          </div>
        </div>

        {/* Content Specific Settings (Example: Alignment) */}
        <div className="space-y-4 pt-4 border-t border-gray-50">
          <div className="flex items-center gap-2 text-[10px] font-extrabold text-gray-300 uppercase tracking-widest mb-4">
            <Type size={12} /> Content
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-xs font-bold text-gray-500">Center Text</Label>
            <Switch 
              checked={selectedSection?.settings?.centerText || false}
              onCheckedChange={(val) => updateSectionSettings({ centerText: val })}
            />
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-gray-100 bg-gray-50/30">
        <Button 
          variant="outline" 
          className="w-full rounded-xl text-red-500 hover:text-red-600 border-red-50 h-10"
          onClick={() => updateContent('selectedId', null)}
        >
          Deselect
        </Button>
      </div>
    </div>
  );
}
