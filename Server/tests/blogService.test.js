import test from "node:test";
import assert from "node:assert/strict";

import {
  buildAdminBlogFilter,
  getBlogById,
} from "../src/services/blogService.js";

test('getBlogById returns null for non-ObjectId values like "all"', async () => {
  const blog = await getBlogById("all");

  assert.equal(blog, null);
});

test("buildAdminBlogFilter normalizes published status aliases", () => {
  for (const status of ["publish", "published", "Publish", "Published"]) {
    assert.equal(buildAdminBlogFilter({ status }).status, "publish");
  }
});

test("buildAdminBlogFilter keeps draft status canonical", () => {
  for (const status of ["draft", "Draft"]) {
    assert.equal(buildAdminBlogFilter({ status }).status, "draft");
  }
});
