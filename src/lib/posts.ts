import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;

export interface CategoryNode {
  path: string;
  slug: string;
  name: string;
  href: string;
  children: CategoryNode[];
  count: number;
}

// Labels are optional cosmetic overrides. A new folder DOES NOT need a new entry here.
const customLabels: Record<string, string> = {
  'cybersec': 'Cybersec',
  'cybersec/ctf': 'CTF',
  'cybersec/ctf/htb': 'Hack The Box',
  'cybersec/ctf/thm': 'TryHackMe',
  'cybersec/re': 'Reverse Engineering',
  'cybersec/malware': 'Malware Analysis',
  'cybersec/dfir': 'DFIR',
  'projects': 'Projects',
  'projects/tools/ida': 'IDA',
  'daily': 'Daily',
  'daily/photos': 'Photo Journal',
  'daily/thoughts': 'Little Thoughts',
  'book': 'Book',
  'book/shelf': 'Bookshelf',
  'temp': 'TEMP',
};

const topOrder = ['cybersec', 'projects', 'daily', 'book'];

export function categoryPath(post: Post): string {
  return post.id.split('/').slice(0, -1).join('/');
}

export function sectionOf(post: Post): string {
  return post.id.split('/')[0] ?? '';
}

export function folderOf(post: Post): string {
  return categoryPath(post).split('/').slice(1).join('/');
}

export function categoryName(path: string): string {
  if (customLabels[path]) return customLabels[path];
  const last = path.split('/').filter(Boolean).at(-1) ?? '';
  return last.replace(/[-_]+/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
}

export function categoryUrl(path: string): string {
  return '/' + path.split('/').filter(Boolean).map(encodeURIComponent).join('/') + '/';
}

export function urlOf(post: Post): string {
  return '/posts/' + post.id.split('/').map(encodeURIComponent).join('/') + '/';
}

export function displayDate(date: Date): string {
  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  return `${day}.${month}.${date.getUTCFullYear()}`;
}

export async function allPosts(): Promise<Post[]> {
  return (await getCollection('posts', ({ data }) => !data.draft))
    .filter(post => Boolean(categoryPath(post)))
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime() || a.id.localeCompare(b.id));
}

export function postsInCategory(posts: Post[], category: string): Post[] {
  return posts.filter(post => {
    const path = categoryPath(post);
    return path === category || path.startsWith(`${category}/`);
  });
}

// Build a tree from every directory ancestor of every published Markdown post.
// Depth is unrestricted: cybersec/ctf/htb/windows/active/... works automatically.
export function buildCategoryTree(posts: Post[]): CategoryNode[] {
  const nodes = new Map<string, CategoryNode>();
  const roots: CategoryNode[] = [];

  for (const post of posts) {
    const parts = categoryPath(post).split('/').filter(Boolean);
    for (let i = 0; i < parts.length; i++) {
      const path = parts.slice(0, i + 1).join('/');
      let node = nodes.get(path);
      if (!node) {
        node = {
          path, slug: parts[i], name: categoryName(path), href: categoryUrl(path),
          children: [], count: 0,
        };
        nodes.set(path, node);
        if (i === 0) roots.push(node);
        else nodes.get(parts.slice(0, i).join('/'))!.children.push(node);
      }
      node.count += 1;
    }
  }

  const sortTree = (items: CategoryNode[], isRoot = false) => {
    items.sort((a, b) => {
      if (isRoot) {
        const ai = topOrder.indexOf(a.path);
        const bi = topOrder.indexOf(b.path);
        if (ai !== -1 || bi !== -1) {
          if (ai === -1) return 1;
          if (bi === -1) return -1;
          return ai - bi;
        }
      }
      return a.name.localeCompare(b.name, 'en', { sensitivity: 'base' });
    });
    for (const item of items) sortTree(item.children);
  };
  sortTree(roots, true);
  return roots;
}

export function flattenCategories(tree: CategoryNode[]): CategoryNode[] {
  return tree.flatMap(node => [node, ...flattenCategories(node.children)]);
}

export function breadcrumbPaths(path: string): { path: string; name: string; href: string }[] {
  const parts = path.split('/').filter(Boolean);
  return parts.map((_, i) => {
    const prefix = parts.slice(0, i + 1).join('/');
    return { path: prefix, name: categoryName(prefix), href: categoryUrl(prefix) };
  });
}
