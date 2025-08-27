import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';

export function AIFeaturesPanel() {
  const [content, setContent] = useState('');
  const [summary, setSummary] = useState('');
  const [sentiment, setSentiment] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSummarize = async () => {
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/analytics/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to summarize');
      setSummary(`Request ID: ${data.requestId} (fetch result from /api/ai/requests/${data.requestId})`);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSentiment = async () => {
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/analytics/sentiment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to analyze sentiment');
      setSentiment(`Request ID: ${data.requestId} (fetch result from /api/ai/requests/${data.requestId})`);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTags = async () => {
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/analytics/smart-tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate tags');
      setTags([`Request ID: ${data.requestId} (fetch result from /api/ai/requests/${data.requestId})`]);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Try AI Features</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Paste or type your text here..."
          rows={5}
        />
        <div className="flex gap-2 mt-4">
          <Button onClick={handleSummarize} disabled={loading || !content}>Summarize</Button>
          <Button onClick={handleSentiment} disabled={loading || !content}>Analyze Sentiment</Button>
          <Button onClick={handleTags} disabled={loading || !content}>Suggest Tags</Button>
        </div>
        {error && <div className="text-red-500 mt-2">{error}</div>}
        {summary && <div className="mt-4"><strong>Summary:</strong> {summary}</div>}
        {sentiment && <div className="mt-4"><strong>Sentiment:</strong> {sentiment}</div>}
        {tags.length > 0 && <div className="mt-4"><strong>Tags:</strong> {tags.join(', ')}</div>}
      </CardContent>
    </Card>
  );
}
