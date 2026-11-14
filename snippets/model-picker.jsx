export const ModelPicker = () => {
  const [models, setModels] = useState([]);
  const [model, setModel] = useState('');
  const [status, setStatus] = useState('Loading models…');
  const [copyStatus, setCopyStatus] = useState('');

  useEffect(() => {
    let active = true;
    let cached = null;
    try {
      const value = JSON.parse(sessionStorage.getItem('hicap-public-model-list-v1') || 'null');
      if (value && Array.isArray(value.ids) && value.ids.every((id) => typeof id === 'string') && typeof value.at === 'number') cached = value;
    } catch {}
    if (cached && Date.now() - cached.at < 5 * 60 * 1000) {
      setModels(cached.ids);
      setStatus(`${cached.ids.length} models available to browse.`);
      return () => { active = false; };
    }

    fetch('https://api.hicap.ai/v1/models', { credentials: 'omit' })
      .then((response) => {
        if (!response.ok) throw new Error('Model list unavailable');
        return response.json();
      })
      .then((data) => {
        if (!Array.isArray(data.data)) throw new Error('Invalid model list');
        const ids = [...new Set(data.data.map((entry) => entry?.id).filter((id) => typeof id === 'string' && id.length > 0))].sort();
        if (!ids.length) throw new Error('Empty model list');
        try { sessionStorage.setItem('hicap-public-model-list-v1', JSON.stringify({ ids, at: Date.now() })); } catch {}
        if (active) {
          setModels(ids);
          setStatus(`${ids.length} models available to browse.`);
        }
      })
      .catch(() => {
        if (!active) return;
        if (cached) {
          setModels(cached.ids);
          setStatus('Could not refresh the model list; showing the previously loaded list.');
        } else {
          setStatus('Could not load the model list. Enter a model ID manually.');
        }
      });
    return () => { active = false; };
  }, []);

  const copyModel = async () => {
    try {
      await navigator.clipboard.writeText(model);
      setCopyStatus('Copied. Paste the ID into the playground model field.');
    } catch {
      setCopyStatus('Copy failed. Select and copy the ID from the field.');
    }
  };

  return (
    <div className="model-picker not-prose">
      <label htmlFor="model-picker-input" className="model-picker-label">Find a model ID</label>
      <p className="model-picker-help">Choose an ID or enter one manually, then copy it into the playground. The public list does not confirm access or endpoint compatibility.</p>
      <div className="model-picker-controls">
        <input id="model-picker-input" list="model-picker-options" value={model} onChange={(event) => { setModel(event.target.value); setCopyStatus(''); }} placeholder="Search or enter a model ID" autoComplete="off" />
        <datalist id="model-picker-options">{models.map((id) => <option key={id} value={id} />)}</datalist>
        <button type="button" disabled={!model.trim()} onClick={copyModel}>Copy ID</button>
      </div>
      <p className="model-picker-status" role="status">{copyStatus || status}</p>
    </div>
  );
};
