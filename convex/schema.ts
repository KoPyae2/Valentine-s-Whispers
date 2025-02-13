import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  posts: defineTable({
    content: v.string(),
    name: v.string(),
    gender: v.union(v.literal("male"), v.literal("female"), v.literal("other")),
    createdAt: v.number(),
    likes: v.number(),
    likedBy: v.array(v.string()),
  }).index("by_creation", ["createdAt"]),
  comments: defineTable({
    postId: v.id("posts"),
    content: v.string(),
    name: v.string(),
    gender: v.union(v.literal("male"), v.literal("female")),
    createdAt: v.number(),
  }).index("by_post", ["postId"]),
});
