
export type BlockType = 
  | 'paragraph' 
  | 'heading1' 
  | 'heading2' 
  | 'heading3' 
  | 'image' 
  | 'bulletList' 
  | 'orderedList' 
  | 'quote' 
  | 'divider' 
  | 'callout' 
  | 'button' 
  | 'table'
  | 'codeBlock'
  | 'embed'
  | 'columns'
  | 'legacy_html';

export interface BlockContent {
  en: string;
  ar: string;
  url?: string; // For images/buttons
  link?: string; // For buttons
  caption?: {
    en: string;
    ar: string;
  };
  left?: { en: string; ar: string };
  right?: { en: string; ar: string };
}

export interface EditorBlock {
  id: string;
  type: BlockType;
  content: BlockContent;
  settings?: {
    align?: 'left' | 'center' | 'right';
    size?: 'small' | 'medium' | 'large' | 'full';
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost'; // For buttons/callouts
  };
}

export interface PostMetadata {
  title: { en: string; ar: string };
  excerpt: { en: string; ar: string };
  slug: string;
  image_url: string;
  author: string;
  status: 'draft' | 'published';
  metaTitle: { en: string; ar: string };
  metaDescription: { en: string; ar: string };
}
