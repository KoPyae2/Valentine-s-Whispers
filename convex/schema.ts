import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  posts: defineTable({
    content: v.string(),
    name: v.string(),
    gender: v.string(),
    createdAt: v.number(),
  }).index("by_creation", ["createdAt"]),
}); 