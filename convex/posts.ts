import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createPost = mutation({
  args: {
    name: v.string(),
    gender: v.union(v.literal("male"), v.literal("female"), v.literal("other")),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const post = await ctx.db.insert("posts", {
      name: args.name,
      gender: args.gender,
      content: args.content,
      createdAt: Date.now(),
      likes: 0,
      likedBy: [],
    });
    return post;
  },
});

export const toggleLike = mutation({
  args: {
    postId: v.id("posts"),
    sessionId: v.string(),
  },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.postId);
    if (!post) return;

    const hasLiked = post.likedBy.includes(args.sessionId);
    
    if (hasLiked) {
      // Unlike
      await ctx.db.patch(args.postId, {
        likes: post.likes - 1,
        likedBy: post.likedBy.filter(id => id !== args.sessionId),
      });
    } else {
      // Like
      await ctx.db.patch(args.postId, {
        likes: post.likes + 1,
        likedBy: [...post.likedBy, args.sessionId],
      });
    }

    return !hasLiked; // Return new like state
  },
});

export const getPosts = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("posts")
      .order("desc")
      .take(100);
  },
});
