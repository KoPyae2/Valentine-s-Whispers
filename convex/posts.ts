import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

// Get all posts with comment counts
export const getPosts = query({
  handler: async (ctx) => {
    const posts = await ctx.db.query("posts").order("desc").take(100);
    const postsWithComments = await Promise.all(
      posts.map(async (post) => {
        const comments = await ctx.db
          .query("comments")
          .withIndex("by_post", (q) => q.eq("postId", post._id))
          .collect();
        return {
          ...post,
          commentCount: comments.length,
        };
      })
    );
    return postsWithComments;
  },
});

// Get a single post with comments
export const getPost = query({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.id as Id<"posts">);
    if (!post) return null;

    const comments = await ctx.db
      .query("comments")
      .withIndex("by_post", (q) => q.eq("postId", post._id))
      .order("desc")
      .collect();

    return {
      ...post,
      comments,
      commentCount: comments.length,
    };
  },
});

// Create a new post
export const createPost = mutation({
  args: {
    content: v.string(),
    name: v.string(),
    gender: v.union(v.literal("male"), v.literal("female"), v.literal("other")),
  },
  handler: async (ctx, args) => {
    const postId = await ctx.db.insert("posts", {
      content: args.content,
      name: args.name,
      gender: args.gender,
      createdAt: Date.now(),
      likes: 0,
      likedBy: [],
    });
    return postId;
  },
});

// Toggle like on a post
export const toggleLike = mutation({
  args: {
    postId: v.id("posts"),
    sessionId: v.string(),
  },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.postId);
    if (!post) throw new Error("Post not found");

    const likedBy = post.likedBy ?? [];
    const isLiked = likedBy.includes(args.sessionId);

    if (isLiked) {
      // Unlike
      await ctx.db.patch(args.postId, {
        likes: (post.likes ?? 0) - 1,
        likedBy: likedBy.filter((id) => id !== args.sessionId),
      });
    } else {
      // Like
      await ctx.db.patch(args.postId, {
        likes: (post.likes ?? 0) + 1,
        likedBy: [...likedBy, args.sessionId],
      });
    }
  },
});

// Create a new comment
export const createComment = mutation({
  args: {
    postId: v.id("posts"),
    content: v.string(),
    name: v.string(),
    gender: v.union(v.literal("male"), v.literal("female")),
  },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.postId);
    if (!post) throw new Error("Post not found");

    await ctx.db.insert("comments", {
      postId: args.postId,
      content: args.content,
      name: args.name,
      gender: args.gender,
      createdAt: Date.now(),
    });

    // Get updated comment count using the index
    const comments = await ctx.db
      .query("comments")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
      .collect();

    return comments.length;
  },
});
