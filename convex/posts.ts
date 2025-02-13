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
    });
    return post;
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
