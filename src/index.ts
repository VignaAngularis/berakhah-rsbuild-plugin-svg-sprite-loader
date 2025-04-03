import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import type { RsbuildPlugin } from '@rsbuild/core';

export type SvgSpriteLoaderOptions = {
  /** SVG files directory path */
  path: string;
  /** Symbol ID template, default: icon-[name] */
  symbolId?: string;
  /** Whether to remove title tags from SVG, default: false */
  removeTitle?: boolean;
};

// Regular expressions
const svgTitle = /<svg([^>]*)>/;
const clearHeightWidth = /(width|height)="([^"]*)"/g;
const hasViewBox = /viewBox="[^"]*"/;
const clearReturn = /[\r\n]/g;
const titleTag = /<title>.*?<\/title>/g;

/**
 * Process SVG content
 * @param content Original SVG content
 * @param name File name
 * @param idPrefix Symbol ID prefix
 * @param removeTitle Whether to remove title tags
 * @returns Processed SVG content
 */
function processSvgContent(
  content: string,
  name: string,
  idPrefix: string,
  removeTitle: boolean,
): string {
  return content
    .replace(clearReturn, '')
    .replace(svgTitle, ($1, $2: string) => {
      let width = 0;
      let height = 0;
      let content = $2.replace(
        clearHeightWidth,
        (match: string, prop: string, value: number) => {
          if (prop === 'width') width = value;
          else if (prop === 'height') height = value;
          return '';
        },
      );

      if (!hasViewBox.test(content)) {
        content += `viewBox="0 0 ${width} ${height}"`;
      }

      const symbolId = idPrefix.replace('[name]', name.replace('.svg', ''));
      return `<symbol id="${symbolId}" ${content}>`;
    })
    .replace('</svg>', '</symbol>')
    .replace(titleTag, removeTitle ? '' : '$&')
    .replaceAll('prefix_', () => idPrefix.replace('[name]', name.replace('.svg', '')));
}

/**
 * Find and process SVG files recursively
 */
function svgFind(directoryPath: string, idPrefix: string, removeTitle: boolean): string[] {
  const svgs: string[] = [];
  const directs = readdirSync(directoryPath, { withFileTypes: true });

  for (const dirent of directs) {
    if (dirent.isDirectory()) {
      svgs.push(...svgFind(join(directoryPath, dirent.name), idPrefix, removeTitle));
    } else if (dirent.name.endsWith('.svg')) {
      const svgContent = readFileSync(join(directoryPath, dirent.name), 'utf-8');
      svgs.push(processSvgContent(svgContent, dirent.name, idPrefix, removeTitle));
    }
  }

  return svgs;
}

/**
 * Create SVG sprite string
 */
function createSvg(path: string, prefix: string, removeTitle: boolean): string {
  if (!path) return '';
  const res = svgFind(path, prefix, removeTitle);
  return res.join('');
}

export const pluginSvgSpriteLoader = (
  options: SvgSpriteLoaderOptions,
): RsbuildPlugin => ({
  name: 'plugin-svg-sprite-loader',

  setup(api) {
    const str = createSvg(
      options.path,
      options.symbolId || 'icon-[name]',
      options.removeTitle ?? false,
    );
    
    api.modifyHTMLTags(({ headTags, bodyTags }) => {
      bodyTags.unshift({
        tag: 'svg',
        attrs: {
          xmlns: 'http://www.w3.org/2000/svg',
          'xmlns:xlink': 'http://www.w3.org/1999/xlink',
          style: 'position: absolute; width: 0; height: 0',
        },
        children: str,
      });

      return { headTags, bodyTags };
    });
  },
});