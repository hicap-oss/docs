export const DiagramToggle = ({ src, alt, title }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="not-prose my-6">
      <button
        type="button"
        aria-expanded={expanded}
        aria-label={`${expanded ? 'Collapse' : 'Expand'} ${title}`}
        onClick={() => setExpanded(!expanded)}
        className="block w-full cursor-pointer rounded-lg text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-600"
      >
        <img
          src={src}
          alt={alt}
          style={{ display: 'block', width: expanded ? '100%' : 'auto', height: 'auto', maxWidth: '100%', maxHeight: expanded ? 'none' : '256px' }}
        />
        <span className="mt-2 block text-sm font-medium">{expanded ? 'Collapse diagram' : 'Expand diagram'}</span>
      </button>
    </div>
  );
};
