import React from "react";
import type { InstagramPost } from "../../lib/instagram/fetch-posts";
import PlaceholderImage from "../PlaceholderImage";

export default function InstagramFeed({ posts }: { posts: InstagramPost[] }) {
  if (!posts || posts.length === 0) return null;

  const displayed = posts.slice(0, 3);

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Latest on Instagram</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {displayed.map((post) => (
          <a
            key={post.id}
            href={post.permalink}
            target="_blank"
            rel="noopener noreferrer"
            title="View on Instagram"
            className="group relative overflow-hidden rounded-lg aspect-square bg-gray-900 hover:opacity-80 transition-opacity"
          >
            {post.media_type === "IMAGE" || post.media_type === "CAROUSEL_ALBUM" ? (
              <PlaceholderImage
                src={post.media_url}
                alt={post.caption || "Instagram post"}
                width={600}
                height={600}
                fill
                placeholderText="Loading..."
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : post.media_type === "VIDEO" ? (
              <video
                src={post.media_url}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : null}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
