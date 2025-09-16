import React, { useState } from 'react';
import { Palette, Type, Layout, Image, Save, RotateCcw, Eye } from 'lucide-react';
import { useSettingsStore } from '../../stores/settingsStore';
import { Card, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export const ThemeCustomizer: React.FC = () => {
  const { 
    themeSettings, 
    updateThemeSettings, 
    saveSettings, 
    resetToDefaults, 
    isSaving 
  } = useSettingsStore();
  
  const [localSettings, setLocalSettings] = useState(themeSettings);
  const [hasChanges, setHasChanges] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const handleColorChange = (colorKey: string, value: string) => {
    const newSettings = {
      ...localSettings,
      colorScheme: {
        ...localSettings.colorScheme,
        [colorKey]: value,
      },
    };
    setLocalSettings(newSettings);
    setHasChanges(true);
  };

  const handleTypographyChange = (category: string, field: string, value: any) => {
    const newSettings = {
      ...localSettings,
      typography: {
        ...localSettings.typography,
        [category]: typeof localSettings.typography[category as keyof typeof localSettings.typography] === 'object'
          ? { ...(localSettings.typography[category as keyof typeof localSettings.typography] as any), [field]: value }
          : value,
      },
    };
    setLocalSettings(newSettings);
    setHasChanges(true);
  };

  const handleLayoutChange = (field: string, value: any) => {
    const newSettings = {
      ...localSettings,
      layout: {
        ...localSettings.layout,
        [field]: value,
      },
    };
    setLocalSettings(newSettings);
    setHasChanges(true);
  };

  const handleBrandingChange = (field: string, value: string) => {
    const newSettings = {
      ...localSettings,
      branding: {
        ...localSettings.branding,
        [field]: value,
      },
    };
    setLocalSettings(newSettings);
    setHasChanges(true);
  };

  const handleSave = async () => {
    updateThemeSettings(localSettings);
    await saveSettings();
    setHasChanges(false);
  };

  const handleReset = () => {
    resetToDefaults('theme');
    setLocalSettings(themeSettings);
    setHasChanges(false);
  };

  const colorOptions = [
    { key: 'primary', label: 'Primary Color', description: 'Main brand color' },
    { key: 'secondary', label: 'Secondary Color', description: 'Secondary elements' },
    { key: 'accent', label: 'Accent Color', description: 'Highlights and accents' },
    { key: 'success', label: 'Success Color', description: 'Success states' },
    { key: 'warning', label: 'Warning Color', description: 'Warning states' },
    { key: 'error', label: 'Error Color', description: 'Error states' },
    { key: 'neutral', label: 'Neutral Color', description: 'Text and borders' },
  ];

  const fontFamilies = [
    'Inter, system-ui, sans-serif',
    'Roboto, sans-serif',
    'Open Sans, sans-serif',
    'Lato, sans-serif',
    'Source Sans Pro, sans-serif',
    'Poppins, sans-serif',
    'Montserrat, sans-serif',
  ];

  return (
    <div className="space-y-6">
      {/* Color Scheme */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Palette size={20} className="text-blue-600" />
              <span>Color Scheme</span>
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPreviewMode(!previewMode)}
              icon={Eye}
            >
              {previewMode ? 'Exit Preview' : 'Preview Changes'}
            </Button>
          </div>
        </CardHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {colorOptions.map((color) => (
            <div key={color.key}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {color.label}
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={localSettings.colorScheme[color.key as keyof typeof localSettings.colorScheme]}
                  onChange={(e) => handleColorChange(color.key, e.target.value)}
                  className="w-12 h-10 border border-gray-300 dark:border-gray-600 rounded cursor-pointer"
                />
                <Input
                  value={localSettings.colorScheme[color.key as keyof typeof localSettings.colorScheme]}
                  onChange={(e) => handleColorChange(color.key, e.target.value)}
                  placeholder="#000000"
                  className="flex-1"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">{color.description}</p>
            </div>
          ))}
        </div>

        {/* Color Preview */}
        <div className="mt-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Color Preview
          </h4>
          <div className="flex flex-wrap gap-3">
            {colorOptions.map((color) => (
              <div key={color.key} className="text-center">
                <div
                  className="w-12 h-12 rounded-lg border border-gray-200 dark:border-gray-700 mb-1"
                  style={{ backgroundColor: localSettings.colorScheme[color.key as keyof typeof localSettings.colorScheme] }}
                />
                <span className="text-xs text-gray-600 dark:text-gray-400 capitalize">
                  {color.key}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Typography */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Type size={20} className="text-green-600" />
            <span>Typography</span>
          </CardTitle>
        </CardHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Font Family
            </label>
            <select
              value={localSettings.typography.fontFamily}
              onChange={(e) => handleTypographyChange('', 'fontFamily', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              {fontFamilies.map((font) => (
                <option key={font} value={font}>
                  {font.split(',')[0]}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Base Font Size (px)"
            type="number"
            value={localSettings.typography.fontSize.base}
            onChange={(e) => handleTypographyChange('fontSize', 'base', parseInt(e.target.value))}
            min={12}
            max={20}
          />

          <Input
            label="Font Scale"
            type="number"
            step="0.125"
            value={localSettings.typography.fontSize.scale}
            onChange={(e) => handleTypographyChange('fontSize', 'scale', parseFloat(e.target.value))}
            min={1.0}
            max={1.5}
          />

          <Input
            label="Normal Line Height"
            type="number"
            step="0.1"
            value={localSettings.typography.lineHeight.normal}
            onChange={(e) => handleTypographyChange('lineHeight', 'normal', parseFloat(e.target.value))}
            min={1.0}
            max={2.0}
          />
        </div>

        {/* Typography Preview */}
        <div className="mt-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Typography Preview
          </h4>
          <div 
            className="space-y-2"
            style={{ 
              fontFamily: localSettings.typography.fontFamily,
              fontSize: `${localSettings.typography.fontSize.base}px`,
              lineHeight: localSettings.typography.lineHeight.normal,
            }}
          >
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Heading 1 - Smart Grid Platform
            </h1>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              Heading 2 - System Overview
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              Body text - This is how regular content will appear with your selected typography settings.
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Small text - Used for captions and secondary information.
            </p>
          </div>
        </div>
      </Card>

      {/* Layout Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Layout size={20} className="text-purple-600" />
            <span>Layout Configuration</span>
          </CardTitle>
        </CardHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Input
            label="Sidebar Width (px)"
            type="number"
            value={localSettings.layout.sidebarWidth}
            onChange={(e) => handleLayoutChange('sidebarWidth', parseInt(e.target.value))}
            min={200}
            max={400}
          />
          <Input
            label="Header Height (px)"
            type="number"
            value={localSettings.layout.headerHeight}
            onChange={(e) => handleLayoutChange('headerHeight', parseInt(e.target.value))}
            min={48}
            max={96}
          />
          <Input
            label="Border Radius (px)"
            type="number"
            value={localSettings.layout.borderRadius}
            onChange={(e) => handleLayoutChange('borderRadius', parseInt(e.target.value))}
            min={0}
            max={24}
          />
          <Input
            label="Base Spacing (px)"
            type="number"
            value={localSettings.layout.spacing}
            onChange={(e) => handleLayoutChange('spacing', parseInt(e.target.value))}
            min={4}
            max={16}
          />
        </div>
      </Card>

      {/* Branding */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Image size={20} className="text-orange-600" />
            <span>Branding & Identity</span>
          </CardTitle>
        </CardHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Company Name"
            value={localSettings.branding.companyName}
            onChange={(e) => handleBrandingChange('companyName', e.target.value)}
          />
          <Input
            label="Tagline"
            value={localSettings.branding.tagline}
            onChange={(e) => handleBrandingChange('tagline', e.target.value)}
          />
          <Input
            label="Logo URL"
            value={localSettings.branding.logo}
            onChange={(e) => handleBrandingChange('logo', e.target.value)}
            placeholder="/logo.svg"
          />
          <Input
            label="Favicon URL"
            value={localSettings.branding.favicon}
            onChange={(e) => handleBrandingChange('favicon', e.target.value)}
            placeholder="/favicon.ico"
          />
        </div>

        {/* Branding Preview */}
        <div className="mt-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Branding Preview
          </h4>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold">
              {localSettings.branding.companyName.charAt(0)}
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white">
                {localSettings.branding.companyName}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {localSettings.branding.tagline}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Save Controls */}
      <Card padding="sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {hasChanges && (
              <span className="text-sm text-yellow-600 dark:text-yellow-400">
                You have unsaved changes
              </span>
            )}
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={handleReset}
              icon={RotateCcw}
              disabled={!hasChanges}
            >
              Reset to Defaults
            </Button>
            <Button
              variant="primary"
              onClick={handleSave}
              loading={isSaving}
              icon={Save}
              disabled={!hasChanges}
            >
              Save Theme Settings
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};