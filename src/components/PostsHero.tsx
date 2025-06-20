import React, { useEffect, useState } from "react";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/firebase";

type Post = {
  id: string;
  title: string;
  createdAt: string | number | { seconds?: number };
  image?: string;
  highlight?: boolean;
};

type PostsHeroProps = {
  postCount: number;
};

const PostsHero: React.FC<PostsHeroProps> = ({ postCount }) => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const fetchedPosts = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title,
            createdAt: data.createdAt,
            image: data.image,
            highlight: data.highlight,
          };
        });
        setPosts(fetchedPosts);
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    };
    fetchPosts();
  }, []);

  const formatDate = (createdAt: string | number | { seconds?: number }) => {
    if (typeof createdAt === "object" && createdAt.seconds) {
      return new Date(createdAt.seconds * 1000).toLocaleDateString();
    }
    return "Unknown Date";
  };

  return (
    <div className="bg-gradient-to-b from-white via-[#f8f9fa] to-[#eaecef] p-8 rounded-2xl shadow-xl border border-[#eee]">
      <h2 className="text-3xl font-extrabold text-[#192349] mb-6 tracking-tight drop-shadow">
        Latest News
      </h2>
      {postCount > 0 ? (
        <ul className="space-y-5">
          {posts.slice(0, postCount).map((post) => (
            <li
              key={post.id}
              className="bg-white border border-[#f2f2f2] rounded-xl shadow-md hover:shadow-xl hover:border-[#f70031]/50 transition-all duration-200"
            >
              <a
                href={`/posts/${post.id}`}
                className="flex items-center space-x-5 p-5 group"
              >
                {post.image && (
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-16 h-16 object-cover rounded-lg border border-[#eee]"
                  />
                )}
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-[#192349] group-hover:text-[#f70031] transition-colors duration-200">
                    {post.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Posted on {formatDate(post.createdAt)}
                  </p>
                </div>
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400 text-center">No posts available</p>
      )}
      {/* 記事一覧ページへの導線ボタン */}
      <div className="mt-6 text-center">
        <a
          href="/posts"
          className="inline-block px-6 py-3 text-white bg-[#f70031] rounded-full hover:bg-[#ff5733] transition-all duration-200"
        >
          View All Articles
        </a>
      </div>
    </div>
  );
};

export default PostsHero;
