"use client";

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Loader2 } from 'lucide-react';
import { BELIEF_CONSTANTS } from '@/lib/constants/belief';
import { Belief, CreateBeliefRequest, UpdateBeliefRequest } from '@/types/belief';
import { cn } from '@/lib/utils';

interface BeliefFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  belief?: Belief | null; // null for create, Belief object for edit
  onSubmit: (data: CreateBeliefRequest | UpdateBeliefRequest) => Promise<void>;
  isLoading?: boolean;
}

export function BeliefFormModal({
  open,
  onOpenChange,
  belief,
  onSubmit,
  isLoading = false
}: BeliefFormModalProps) {
  const isEditing = !!belief;

  // Form state
  const [topic, setTopic] = useState('');
  const [description, setDescription] = useState('');
  const [confidenceInitial, setConfidenceInitial] = useState(50);
  const [confidenceCurrent, setConfidenceCurrent] = useState(50);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form when belief changes
  useEffect(() => {
    if (belief) {
      setTopic(belief.topic);
      setDescription(belief.description || '');
      setConfidenceInitial(belief.confidence_initial);
      setConfidenceCurrent(belief.confidence_current);
      setTags(belief.tags || []);
    } else {
      // Reset form for create
      setTopic('');
      setDescription('');
      setConfidenceInitial(50);
      setConfidenceCurrent(50);
      setTags([]);
    }
    setNewTag('');
    setErrors({});
  }, [belief, open]);

  // Validation function
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!topic.trim()) {
      newErrors.topic = 'Topic is required';
    } else if (topic.length < BELIEF_CONSTANTS.VALIDATION.TOPIC.MIN_LENGTH) {
      newErrors.topic = `Topic must be at least ${BELIEF_CONSTANTS.VALIDATION.TOPIC.MIN_LENGTH} characters`;
    } else if (topic.length > BELIEF_CONSTANTS.VALIDATION.TOPIC.MAX_LENGTH) {
      newErrors.topic = `Topic must be no more than ${BELIEF_CONSTANTS.VALIDATION.TOPIC.MAX_LENGTH} characters`;
    }

    if (description && description.length > BELIEF_CONSTANTS.VALIDATION.DESCRIPTION.MAX_LENGTH) {
      newErrors.description = `Description must be no more than ${BELIEF_CONSTANTS.VALIDATION.DESCRIPTION.MAX_LENGTH} characters`;
    }

    if (tags.length > BELIEF_CONSTANTS.VALIDATION.TAGS.MAX_COUNT) {
      newErrors.tags = `Maximum ${BELIEF_CONSTANTS.VALIDATION.TAGS.MAX_COUNT} tags allowed`;
    }

    const invalidTags = tags.filter(tag => tag.length > BELIEF_CONSTANTS.VALIDATION.TAGS.MAX_LENGTH);
    if (invalidTags.length > 0) {
      newErrors.tags = `Tags must be no more than ${BELIEF_CONSTANTS.VALIDATION.TAGS.MAX_LENGTH} characters`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const formData = {
      topic: topic.trim(),
      description: description.trim() || undefined,
      confidence_initial: confidenceInitial,
      confidence_current: confidenceCurrent,
      tags: tags.length > 0 ? tags : undefined,
    };

    try {
      await onSubmit(formData);
      onOpenChange(false);
    } catch (error) {
      // Error handling is done in the parent component
      console.error('Form submission error:', error);
    }
  };

  // Add tag function
  const addTag = () => {
    const trimmedTag = newTag.trim();
    if (trimmedTag && !tags.includes(trimmedTag) && tags.length < BELIEF_CONSTANTS.VALIDATION.TAGS.MAX_COUNT) {
      setTags([...tags, trimmedTag]);
      setNewTag('');
    }
  };

  // Remove tag function
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // Handle tag input keydown
  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-black border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black tracking-tighter">
            {isEditing ? 'Edit Belief' : 'Create New Belief'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Topic */}
          <div className="space-y-2">
            <Label htmlFor="topic" className="text-white font-bold">
              Topic *
            </Label>
            <Input
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Universal Basic Income, Nuclear Energy, Remote Work"
              className={cn(
                "bg-white/5 border-white/10 text-white placeholder:text-zinc-500",
                errors.topic && "border-red-500 focus:border-red-500"
              )}
              aria-describedby={errors.topic ? "topic-error" : undefined}
              disabled={isLoading}
            />
            {errors.topic && (
              <p id="topic-error" className="text-red-400 text-sm" role="alert">
                {errors.topic}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-white font-bold">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain your current stance and what led to this belief..."
              rows={3}
              className={cn(
                "bg-white/5 border-white/10 text-white placeholder:text-zinc-500 resize-none",
                errors.description && "border-red-500 focus:border-red-500"
              )}
              aria-describedby={errors.description ? "description-error" : undefined}
              disabled={isLoading}
            />
            <div className="text-xs text-zinc-500 text-right">
              {description.length}/{BELIEF_CONSTANTS.VALIDATION.DESCRIPTION.MAX_LENGTH}
            </div>
            {errors.description && (
              <p id="description-error" className="text-red-400 text-sm" role="alert">
                {errors.description}
              </p>
            )}
          </div>

          {/* Confidence sliders */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Initial Confidence */}
            <div className="space-y-3">
              <Label className="text-white font-bold">
                Initial Confidence: {confidenceInitial}%
              </Label>
              <Slider
                value={[confidenceInitial]}
                onValueChange={(value) => setConfidenceInitial(value[0])}
                max={100}
                min={0}
                step={5}
                className="w-full"
                disabled={isLoading}
                aria-label="Initial confidence level"
              />
              <div className="flex justify-between text-xs text-zinc-500">
                <span>0%</span>
                <span>100%</span>
              </div>
            </div>

            {/* Current Confidence */}
            <div className="space-y-3">
              <Label className="text-white font-bold">
                Current Confidence: {confidenceCurrent}%
              </Label>
              <Slider
                value={[confidenceCurrent]}
                onValueChange={(value) => setConfidenceCurrent(value[0])}
                max={100}
                min={0}
                step={5}
                className="w-full"
                disabled={isLoading}
                aria-label="Current confidence level"
              />
              <div className="flex justify-between text-xs text-zinc-500">
                <span>0%</span>
                <span>100%</span>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-3">
            <Label className="text-white font-bold">Tags</Label>

            {/* Tag input */}
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder="Add a tag..."
                className="bg-white/5 border-white/10 text-white placeholder:text-zinc-500 flex-1"
                disabled={isLoading || tags.length >= BELIEF_CONSTANTS.VALIDATION.TAGS.MAX_COUNT}
              />
              <Button
                type="button"
                onClick={addTag}
                disabled={!newTag.trim() || tags.includes(newTag.trim()) || tags.length >= BELIEF_CONSTANTS.VALIDATION.TAGS.MAX_COUNT || isLoading}
                className="bg-white/10 hover:bg-white/20 border border-white/20"
                size="sm"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Tag display */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-zinc-800/50 text-zinc-300 border-zinc-700/50 pr-1"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 hover:text-red-400 transition-colors"
                      aria-label={`Remove tag: ${tag}`}
                      disabled={isLoading}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            <div className="text-xs text-zinc-500">
              {tags.length}/{BELIEF_CONSTANTS.VALIDATION.TAGS.MAX_COUNT} tags
            </div>

            {errors.tags && (
              <p className="text-red-400 text-sm" role="alert">
                {errors.tags}
              </p>
            )}
          </div>

          {/* Form actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-white/10">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="border-white/20 text-white hover:bg-white/5"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !topic.trim()}
              className="bg-white text-black hover:bg-zinc-200 font-bold px-6"
            >
              {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {isEditing ? 'Update Belief' : 'Create Belief'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}