'use client';

import React, { useState } from 'react';
import { Modal, Input, Button, ErrorAlert } from '@/components/ui';
import { topicApi } from '@/lib/api';
import { CreateTopicResponseData } from '@/types';
import { Sparkles, PlusCircle } from 'lucide-react';

interface CreateTopicModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTopicCreated: (topic: CreateTopicResponseData) => void;
}

export const CreateTopicModal: React.FC<CreateTopicModalProps> = ({
  isOpen,
  onClose,
  onTopicCreated,
}) => {
  const [title, setTitle] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError('Topic title is required.');
      return;
    }
    if (trimmedTitle.length < 2) {
      setError('Topic title must be at least 2 characters long.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const newTopic = await topicApi.createTopic({ title: trimmedTitle });
      setTitle('');
      onTopicCreated(newTopic);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to create topic. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setTitle('');
    setError(null);
    onClose();
  };

  const suggestedTopics = [
    'System Design & Microservices Architecture',
    'PostgreSQL Query Optimization & Indexing',
    'React Server Components & Next.js 15',
    'TypeScript Advanced Generics & Type Gymnastics',
    'Distributed Caching with Redis & Memcached',
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create New Learning Topic"
      description="Define a subject or skill you want to explore with Cognibloom AI."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <ErrorAlert message={error} onDismiss={() => setError(null)} />}

        <Input
          label="Topic Title"
          placeholder="e.g. Distributed Systems & Consensus Algorithms"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (error) setError(null);
          }}
          autoFocus
          disabled={isLoading}
          required
          helperText="Keep it descriptive so Cognibloom AI can tailor its curriculum and socratic questions."
        />

        <div className="pt-2">
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-2">
            Suggested Quick Ideas
          </label>
          <div className="flex flex-wrap gap-1.5">
            {suggestedTopics.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => setTitle(suggestion)}
                className="text-[11px] bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200 transition-colors text-left"
              >
                + {suggestion}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
          <Button type="button" variant="outline" size="md" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isLoading}
            leftIcon={<PlusCircle className="w-4 h-4" />}
            rightIcon={<Sparkles className="w-4 h-4" />}
          >
            Create Topic
          </Button>
        </div>
      </form>
    </Modal>
  );
};
