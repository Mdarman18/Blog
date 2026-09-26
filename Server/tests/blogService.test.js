import test from "node:test";
import assert from "node:assert/strict";

import { getBlogById } from "../src/services/blogService.js";

test('getBlogById returns null for non-ObjectId values like "all"', async () => {
  const blog = await getBlogById("all");

  assert.equal(blog, null);
});
