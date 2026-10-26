import { memo, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import rehypeDocs from '../markdown/rehypeDocs.js';

function CodeBlock({ children, node, ...props }) {
  const ref = useRef(null);
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    const text = ref.current?.innerText ?? '';
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };
  return (
    <div className="code-wrap">
      <button type="button" className="copy-btn" onClick={copy} aria-label="Copiar código">
        {copied ? '¡Copiado!' : 'Copiar'}
      </button>
      <pre ref={ref} {...props}>
        {children}
      </pre>
    </div>
  );
}

function Anchor({ href = '', children, node, ...props }) {
  if (href.startsWith('#/')) return <a href={href} {...props}>{children}</a>;
  if (/^(https?:|mailto:)/i.test(href))
    return (
      <a href={href} target="_blank" rel="noreferrer noopener" className="ext" title={`${href} (externo, requiere internet)`} {...props}>
        {children}
      </a>
    );
  return <span className="broken-link">{children}</span>;
}

const components = { pre: CodeBlock, a: Anchor };
const remarkPlugins = [remarkGfm];
const rehypePlugins = [rehypeRaw, rehypeDocs, [rehypeHighlight, { detect: false, plainText: ['text', 'txt', 'plain'] }]];

// Evita que react-markdown descarte los links "#/doc/…" o "#roto".
const urlTransform = (url) => url;

function Markdown({ md }) {
  return (
    <ReactMarkdown remarkPlugins={remarkPlugins} rehypePlugins={rehypePlugins} components={components} urlTransform={urlTransform}>
      {md}
    </ReactMarkdown>
  );
}

export default memo(Markdown);
