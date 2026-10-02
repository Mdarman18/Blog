export const normalizeBlogStatus = (status) => {
  const normalized =
    typeof status === "string" ? status.trim().toLowerCase() : "";
  return normalized === "published" ? "publish" : normalized;
};

// FIX: axios response ko unwrap karo, aur data.data object ke andar se array dhoondo
export const normalizeBlogList = (res) => {
  // Axios response ho to body nikalo, warna res ko hi body maan lo
  const body = res?.config ? res.data : res;
  const payload = body?.data ?? body;
  let blogs = [];
  if (Array.isArray(payload)) {
    blogs = payload;
  } else if (payload && typeof payload === "object") {
    blogs =
      payload.blogs ||
      payload.posts ||
      payload.docs ||
      payload.items ||
      Object.values(payload).find(Array.isArray) ||
      [];
  }
  // Pagination body ke top level pe hai (res.data.pagination)
  const p = body?.pagination || payload?.pagination || {};
  const total = p.total ?? p.totalBlogs ?? p.totalDocs ?? body?.total;
  const page = p.page ?? p.currentPage ?? 1;
  const totalPages =
    p.totalPages ??
    p.pages ??
    p.totalPage ??
    (total ? Math.ceil(total / 6) : 1);

  return { blogs, total, page, totalPages };
};

export const normalizeUser = (res) => {
  const body = res?.config ? res.data : res;
  const payload = body?.data ?? body;
  return payload?.user || body?.user || payload || null;
};

export const normalizeAuthToken = (res) => {
  const body = res?.config ? res.data : res;
  const payload = body?.data ?? body;
  return payload?.token || body?.token || null;
};

export const getBlogId = (blog) => {
  return blog?._id || blog?.id;
};

export const normalizeAdminStats = (res) => {
  const body = res?.config ? res.data : res;
  const payload = body?.data ?? body;
  // FIX: backend stats ko `blogs` key ke andar bhejta hai ({ blogs: { total, published, draft } })
  const s = payload?.stats || payload?.blogs || body?.stats || payload || {};

  const pick = (...keys) => {
    for (const k of keys) {
      if (s[k] !== undefined && s[k] !== null) return Number(s[k]);
    }
    return undefined;
  };

  const total = pick(
    "total",
    "totalBlogs",
    "totalPosts",
    "totalCount",
    "count",
  );
  const published = pick(
    "published",
    "publishedBlogs",
    "publishedPosts",
    "publishedCount",
  );
  const draft = pick(
    "draft",
    "drafts",
    "draftBlogs",
    "draftPosts",
    "draftCount",
  );

  return {
    total: total ?? (published ?? 0) + (draft ?? 0),
    published: published ?? 0,
    draft: draft ?? 0,
  };
};
export const normalizeBlog = (res) => {
  const body = res?.config ? res.data : res;
  const payload = body?.data ?? body;
  return payload?.blog || payload?.post || payload?.doc || payload;
};
