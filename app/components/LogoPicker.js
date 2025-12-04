'use client';

import { useState, useMemo } from 'react';
import * as LucideIcons from 'lucide-react';

const ICON_LIBRARY = [
  { id: 'shopping-cart', name: 'Shopping', lucideIcon: 'ShoppingCart', color: 'from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20' },
  { id: 'message-circle', name: 'Chat', lucideIcon: 'MessageCircle', color: 'from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20' },
  { id: 'clipboard-list', name: 'Tasks', lucideIcon: 'ClipboardList', color: 'from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20' },
  { id: 'bar-chart-3', name: 'Analytics', lucideIcon: 'BarChart3', color: 'from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20' },
  { id: 'code-2', name: 'Code', lucideIcon: 'Code2', color: 'from-cyan-50 to-blue-50 dark:from-cyan-950/20 dark:to-blue-950/20' },
  { id: 'smartphone', name: 'Mobile', lucideIcon: 'Smartphone', color: 'from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20' },
  { id: 'database', name: 'Database', lucideIcon: 'Database', color: 'from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20' },
  { id: 'cloud', name: 'Cloud', lucideIcon: 'Cloud', color: 'from-sky-50 to-cyan-50 dark:from-sky-950/20 dark:to-cyan-950/20' },
  { id: 'rocket', name: 'Launch', lucideIcon: 'Rocket', color: 'from-violet-50 to-purple-50 dark:from-violet-950/20 dark:to-purple-950/20' },
  { id: 'palette', name: 'Design', lucideIcon: 'Palette', color: 'from-fuchsia-50 to-pink-50 dark:from-fuchsia-950/20 dark:to-pink-950/20' },
  { id: 'brain', name: 'AI/ML', lucideIcon: 'Brain', color: 'from-indigo-50 to-blue-50 dark:from-indigo-950/20 dark:to-blue-950/20' },
  { id: 'shield', name: 'Security', lucideIcon: 'Shield', color: 'from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20' },
  { id: 'terminal', name: 'Terminal', lucideIcon: 'Terminal', color: 'from-slate-50 to-gray-50 dark:from-slate-950/20 dark:to-gray-950/20' },
  { id: 'layout', name: 'Web', lucideIcon: 'Layout', color: 'from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20' },
  { id: 'zap', name: 'API', lucideIcon: 'Zap', color: 'from-teal-50 to-cyan-50 dark:from-teal-950/20 dark:to-cyan-950/20' },
  { id: 'server', name: 'Server', lucideIcon: 'Server', color: 'from-gray-50 to-slate-50 dark:from-gray-950/20 dark:to-slate-950/20' }
];

export default function LogoPicker({ value, onChange, gradientColor }) {
  const [activeTab, setActiveTab] = useState('icons');
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadPreview, setUploadPreview] = useState(null);
  const [imageUrl, setImageUrl] = useState('');

  const filteredIcons = useMemo(() => {
    if (!searchQuery.trim()) return ICON_LIBRARY;
    const query = searchQuery.toLowerCase();
    return ICON_LIBRARY.filter(icon =>
      icon.name.toLowerCase().includes(query) ||
      icon.id.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match(/^image\/(svg\+xml|png)$/)) {
      alert('Please upload only SVG or PNG files');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('File size must be less than 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      setUploadPreview(dataUrl);
      onChange({
        type: 'custom',
        data: dataUrl,
        color: gradientColor || 'from-gray-50 to-gray-100 dark:from-gray-950/20 dark:to-gray-900/20'
      });
    };
    reader.readAsDataURL(file);
  };

  const handleLibrarySelect = (icon) => {
    onChange({
      type: 'library',
      data: icon.id,
      lucideIcon: icon.lucideIcon,
      color: icon.color
    });
  };

  const handleImageUrl = () => {
    if (!imageUrl.trim()) return;
    onChange({
      type: 'image',
      data: imageUrl.trim(),
      color: gradientColor || 'from-gray-50 to-gray-100 dark:from-gray-950/20 dark:to-gray-900/20'
    });
  };

  const handleRemove = () => {
    onChange(null);
    setUploadPreview(null);
    setSearchQuery('');
    setImageUrl('');
  };

  const selectedIcon = value?.type === 'library'
    ? ICON_LIBRARY.find(icon => icon.id === value.data)
    : null;

  return (
    <div className="border border-black/10 dark:border-white/10 rounded-lg overflow-hidden">
      {/* Header with tabs and remove button */}
      <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 px-4 py-2">
        <div className="flex gap-6">
          <button
            type="button"
            onClick={() => setActiveTab('icons')}
            className={`py-2 text-sm font-medium transition-colors relative ${
              activeTab === 'icons'
                ? 'text-black dark:text-white'
                : 'text-black/50 dark:text-white/50 hover:text-black/70 dark:hover:text-white/70'
            }`}
          >
            Icons
            {activeTab === 'icons' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black dark:bg-white" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`py-2 text-sm font-medium transition-colors relative ${
              activeTab === 'upload'
                ? 'text-black dark:text-white'
                : 'text-black/50 dark:text-white/50 hover:text-black/70 dark:hover:text-white/70'
            }`}
          >
            Upload
            {activeTab === 'upload' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black dark:bg-white" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`py-2 text-sm font-medium transition-colors relative ${
              activeTab === 'url'
                ? 'text-black dark:text-white'
                : 'text-black/50 dark:text-white/50 hover:text-black/70 dark:hover:text-white/70'
            }`}
          >
            Image URL
            {activeTab === 'url' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black dark:bg-white" />
            )}
          </button>
        </div>
        {value && (
          <button
            type="button"
            onClick={handleRemove}
            className="text-sm text-black/60 dark:text-white/60 hover:text-red-600 dark:hover:text-red-400 transition-colors"
          >
            Remove
          </button>
        )}
      </div>

      {/* Search bar (only for icons tab) */}
      {activeTab === 'icons' && (
        <div className="p-4 border-b border-black/10 dark:border-white/10">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <LucideIcons.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40 dark:text-white/40" />
              <input
                type="text"
                placeholder="Filter..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-lg text-black dark:text-white placeholder:text-black/40 dark:placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white"
                >
                  <LucideIcons.X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        {activeTab === 'icons' && (
          <div>
            {filteredIcons.length > 0 ? (
              <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2">
                {filteredIcons.map((icon) => {
                  const IconComponent = LucideIcons[icon.lucideIcon] || LucideIcons.Package;
                  return (
                    <button
                      key={icon.id}
                      type="button"
                      onClick={() => handleLibrarySelect(icon)}
                      className={`relative aspect-square rounded-md bg-gradient-to-br ${icon.color} flex items-center justify-center group hover:scale-110 transition-all ${
                        selectedIcon?.id === icon.id
                          ? 'ring-2 ring-black dark:ring-white shadow-lg'
                          : 'hover:ring-1 hover:ring-black/30 dark:hover:ring-white/30'
                      }`}
                      title={icon.name}
                    >
                      <IconComponent className="w-5 h-5 text-black/15 dark:text-white/15" />
                      {selectedIcon?.id === icon.id && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-black dark:bg-white rounded-full flex items-center justify-center">
                          <LucideIcons.Check className="w-2.5 h-2.5 text-white dark:text-black" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-black/40 dark:text-white/40">
                No icons found
              </div>
            )}
          </div>
        )}

        {activeTab === 'upload' && (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-black/10 dark:border-white/10 rounded-lg p-8 text-center hover:border-black/20 dark:hover:border-white/20 transition-colors">
              <input
                type="file"
                id="logo-upload"
                accept=".svg,.png,image/svg+xml,image/png"
                onChange={handleFileUpload}
                className="hidden"
              />
              <label
                htmlFor="logo-upload"
                className="cursor-pointer inline-flex flex-col items-center"
              >
                <LucideIcons.Upload className="w-12 h-12 text-black/20 dark:text-white/20 mb-3" />
                <span className="text-black dark:text-white font-medium mb-1">
                  Click to upload
                </span>
                <span className="text-black/60 dark:text-white/60 text-sm">
                  SVG or PNG (max 2MB)
                </span>
              </label>
            </div>

            {(uploadPreview || value?.type === 'custom') && (
              <div className="border border-black/10 dark:border-white/10 rounded-lg p-4">
                <p className="text-sm text-black/60 dark:text-white/60 mb-3">Preview:</p>
                <div className={`w-32 h-32 rounded-lg bg-gradient-to-br ${value?.color} flex items-center justify-center mx-auto`}>
                  <img
                    src={uploadPreview || value?.data}
                    alt="Logo preview"
                    className="max-w-full max-h-full p-4"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'url' && (
          <div className="space-y-4">
            <div className="space-y-3">
              <label className="block text-sm font-medium text-black dark:text-white">
                Image URL
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-2 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-lg text-black dark:text-white placeholder:text-black/40 dark:placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20"
              />
              <button
                type="button"
                onClick={handleImageUrl}
                disabled={!imageUrl.trim()}
                className="w-full px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg font-medium hover:bg-black/80 dark:hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Use Image URL
              </button>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-xs text-blue-800 dark:text-blue-200 mb-2 font-medium">
                Recommended free image hosts:
              </p>
              <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                <li>• Cloudinary (25GB free)</li>
                <li>• Imgur (Free, simple)</li>
                <li>• Unsplash (Free stock photos)</li>
              </ul>
            </div>

            {value?.type === 'image' && (
              <div className="border border-black/10 dark:border-white/10 rounded-lg p-4">
                <p className="text-sm text-black/60 dark:text-white/60 mb-3">Preview:</p>
                <div className="w-full h-32 rounded-lg overflow-hidden bg-black/5 dark:bg-white/5 flex items-center justify-center">
                  <img
                    src={value.data}
                    alt="Image preview"
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => {
                      e.target.parentElement.innerHTML = '<span class="text-red-500 text-sm">Failed to load image</span>';
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
