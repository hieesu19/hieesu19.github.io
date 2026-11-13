import { allPosts, buildCategoryTree } from './posts';

// No hard-coded sidebar. Every non-draft .md inside a folder contributes to this tree.
export async function navigation() {
  return buildCategoryTree(await allPosts());
}
