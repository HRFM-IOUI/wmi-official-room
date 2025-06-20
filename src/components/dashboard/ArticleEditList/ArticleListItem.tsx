import React from "react";
import styles from "./ArticleEditList.module.css";
import ReactMarkdown from "react-markdown";

type BlockType = "heading" | "text" | "image" | "video";
type Block = { id: string; type: BlockType; content: string };

type PostStatus = "published" | "draft";
type Post = {
  id: string;
  blocks: Block[];
  tags?: string[];
  createdAt?: Date | { toDate(): Date } | null;
  status?: PostStatus;
};

type Props = {
  post: Post;
  selected: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onToggleStatus: () => void;
  onDuplicate: () => void;
  onSelect: (checked: boolean) => void;
};

const statusColor: Record<PostStatus, string> = {
  published: "#00b894",
  draft: "#babfca",
};

export default function ArticleListItem({
  post, selected, onEdit, onDelete, onToggleStatus, onDuplicate, onSelect,
}: Props) {
  // 日付の整形
  let createdAtStr = "";
  if (post.createdAt) {
    if (
      typeof post.createdAt === "object" &&
      "toDate" in post.createdAt &&
      typeof post.createdAt.toDate === "function"
    ) {
      createdAtStr = post.createdAt.toDate().toLocaleString();
    } else if (post.createdAt instanceof Date) {
      createdAtStr = post.createdAt.toLocaleString();
    }
  }

  // 最初の画像 or テキストブロック
  const firstImage = post.blocks.find(b => b.type === "image" && b.content);
  const firstText = post.blocks.find(b => (b.type === "heading" || b.type === "text") && b.content);

  return (
    <li
      className={styles.listItem}
      style={{
        background: post.status === "draft" ? "#f5f7fa" : "#fff",
      }}
    >
      <div className={styles.listItemCheck}>
        <input
          type="checkbox"
          checked={selected}
          onChange={e => onSelect(e.target.checked)}
          aria-label="記事を選択"
        />
      </div>
      <div className={styles.listItemMain}>
        {/* サムネイル表示 */}
        {firstImage && (
          <img
            src={firstImage.content}
            alt="thumbnail"
            style={{ width: 64, height: 64, objectFit: "cover", borderRadius: 6, marginRight: 12 }}
          />
        )}
        <span className={styles.listItemTitle}>
          {/* 見出し・テキストブロックの最初の一文だけMarkdown描画 */}
          {firstText ? (
            <ReactMarkdown>
              {firstText.content.slice(0, 40) + (firstText.content.length > 40 ? "..." : "")}
            </ReactMarkdown>
          ) : (
            "(無題)"
          )}
        </span>
        <span className={styles.listItemDate}>
          {createdAtStr}
        </span>
        {post.tags && post.tags.length > 0 && (
          <span className={styles.listItemTags}>
            {post.tags.map((tag, i) => (
              <span key={`${tag}_${i}`} className={styles.tag}>
                #{tag}
              </span>
            ))}
          </span>
        )}
      </div>
      <div className={styles.listItemButtons}>
        <button
          className={styles.statusButton}
          style={{ background: statusColor[post.status ?? "draft"] }}
          onClick={onToggleStatus}
          aria-label={post.status === "published" ? "下書きにする" : "公開にする"}
          type="button"
        >
          {post.status === "published" ? "公開中" : "下書き"}
        </button>
        <button
          className={styles.editButton}
          onClick={onEdit}
          aria-label="編集"
          type="button"
        >
          編集
        </button>
        <button
          className={styles.duplicateButton}
          onClick={onDuplicate}
          aria-label="複製"
          type="button"
        >
          複製
        </button>
        <button
          className={styles.deleteButton}
          onClick={onDelete}
          aria-label="削除"
          type="button"
        >
          削除
        </button>
      </div>
    </li>
  );
}
