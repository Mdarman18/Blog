import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function MarkdownContent({ children }) {
  const markdown = typeof children === "string" ? children : "";

  return (
    <article className="prose prose-gray max-w-none dark:prose-invert">
      {markdown.trim() ? (
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
      ) : null}
    </article>
  );
}
