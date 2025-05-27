import React from "react";
import { useFetcher } from "react-router";
import { toast } from "sonner";
import { z } from "zod";
import { getErrorMessage } from "~/utils/misc";

/**
 * Schema defining all possible content operation intents.
 * Used to ensure type safety for content operations.
 */
export const ContentIntentSchema = z.enum([
  "add-comment",
  "update-comment",
  "add-reply",
  "update-reply",
  "upvote-comment",
  "upvote-reply",
  "delete-comment",
  "delete-reply",
]);

export type ContentIntent = z.infer<typeof ContentIntentSchema>;

/**
 * Schema for validating arbitrary data constraints.
 * Used as a base for content operation payloads.
 */
export const DataConstraintSchema = z.record(z.unknown());

/**
 * Schema for optimistic submission payloads.
 * Defines the structure of data sent to the server.
 */
export const OptimisticSubmitSchema = z.object({
  /** Optional key for identifying the submission */
  key: z.string().optional(),
  /** The data payload for the operation */
  data: DataConstraintSchema,
  /** The type of content operation to perform */
  intent: ContentIntentSchema,
  /** Optional success message to show after operation */
  toastMessage: z.string().optional(),
});

/**
 * Schema for content update operations.
 * Defines the structure of data for updating content.
 */
export const UpdateSchema = z.object({
  /** Optional key for identifying the update */
  key: z.string().optional(),
  /** The type of content operation to perform */
  intent: ContentIntentSchema,
  /** ID of the parent content (if applicable) */
  parentId: z.string().nullable(),
  /** ID of the content being operated on */
  itemId: z.string().nullable(),
  /** ID of the user performing the operation */
  userId: z.string(),
  /** The content text (if applicable) */
  content: z.string().min(1).optional(),
  /** Optional success message to show after operation */
  toastMessage: z.string().optional(),
});

type OptimisticSubmit = z.infer<typeof OptimisticSubmitSchema>;
type Update = z.infer<typeof UpdateSchema>;

/** Return type from optimistic hooks */
type OptimisticReturn = {
  /** Function to trigger the submission */
  submit: () => void;
  /** True during submission, false otherwise */
  isPending: boolean;
  /** Error object if submission failed, null otherwise */
  error: Error | null;
};

/**
 * Base hook for optimistic content operations.
 * Handles the core submission logic and error handling.
 *
 * @template T - Data payload type
 * @param {OptimisticSubmit} params - Submission parameters
 * @returns {OptimisticReturn} Operation state and controls
 *
 * @example
 * ```tsx
 * const { submit, isPending, error } = useOptimisticSubmit({
 *   key: 'comment-123',
 *   intent: 'add-comment',
 *   data: { content: 'Hello world' },
 *   toastMessage: 'Comment posted!'
 * });
 *
 * // Use in a component
 * <button onClick={submit} disabled={isPending}>
 *   {isPending ? 'Posting...' : 'Post Comment'}
 * </button>
 * ```
 */
function useOptimisticSubmit({
  key,
  data,
  intent,
  toastMessage,
}: OptimisticSubmit) {
  const fetcher = useFetcher({ key: key || intent });

  const submit = React.useCallback(() => {
    try {
      const parsed = OptimisticSubmitSchema.parse({
        key,
        data,
        intent,
        toastMessage,
      });
      fetcher.submit({ ...parsed.data, intent }, { method: "post" });
    } catch (err) {
      toast.error("Invalid request data");
      console.error(err);
    }
    // Remove fetcher from deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, data, intent, toastMessage]);

  React.useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      if (fetcher.data.success && toastMessage) {
        toast.success(toastMessage);
      } else if (fetcher.data.error) {
        toast.error(getErrorMessage(fetcher.data.error));
      }
    }
  }, [fetcher.state, fetcher.data, toastMessage]);

  return {
    submit,
    isPending: fetcher.state === "submitting",
    error: fetcher.data?.error || null,
  };
}

/**
 * Hook for submitting comments with optimistic updates.
 * Handles comment creation and updates with proper error handling.
 *
 * @param {Update} params - Comment parameters
 * @returns {OptimisticReturn} Submission state and controls
 *
 * @example
 * ```tsx
 * const { submit, isPending } = useSubmitComment({
 *   key: `post-${postId}-comments`,
 *   intent: 'add-comment',
 *   itemId: postId,
 *   userId: currentUser.id,
 *   content: 'Great post!',
 *   toastMessage: 'Comment posted successfully!'
 * });
 * ```
 */
export function useSubmitComment(params: Update): OptimisticReturn {
  return useOptimisticSubmit({
    key: params.key,
    intent: params.intent,
    toastMessage: params.toastMessage,
    data: {
      content: params.content,
      parentId: params.parentId,
      itemId: params.itemId,
      userId: params.userId,
    },
  });
}

/**
 * Hook for handling content upvoting with optimistic UI.
 * Manages upvote state and provides immediate feedback.
 *
 * @param {Omit<Update, "content" | "parentId">} params - Upvote parameters
 * @returns {OptimisticReturn} Submission state and controls
 *
 * @example
 * ```tsx
 * const { submit, isPending } = useContentUpvote({
 *   key: `post-${postId}-upvotes`,
 *   intent: isUpvoted ? 'remove-upvote' : 'upvote-comment',
 *   itemId: postId,
 *   userId: currentUser.id,
 *   toastMessage: isUpvoted ? 'Upvote removed' : 'Post upvoted!'
 * });
 * ```
 */
export function useContentUpvote(
  params: Omit<Update, "content" | "parentId">,
): OptimisticReturn {
  return useOptimisticSubmit({
    key: params.key,
    intent: params.intent,
    toastMessage: params.toastMessage,
    data: {
      itemId: params.itemId,
      userId: params.userId,
    },
  });
}

/**
 * Hook for handling comment deletion with optimistic UI.
 * Provides immediate feedback and handles error states.
 *
 * @param {Omit<Update, "content" | "parentId">} params - Deletion parameters
 * @returns {OptimisticReturn} Submission state and controls
 *
 * @example
 * ```tsx
 * const { submit, error } = useDeleteComment({
 *   key: `comment-${commentId}`,
 *   intent: 'delete-comment',
 *   itemId: commentId,
 *   userId: currentUser.id,
 *   toastMessage: 'Comment deleted successfully'
 * });
 * ```
 */
export function useDeleteComment(
  params: Omit<Update, "content" | "parentId">,
): OptimisticReturn {
  return useOptimisticSubmit({
    key: params.key,
    intent: params.intent,
    toastMessage: params.toastMessage,
    data: {
      itemId: params.itemId,
      userId: params.userId,
    },
  });
}

/**
 * Hook for handling comment updates with optimistic UI.
 * Manages comment editing with immediate feedback.
 *
 * @param {Omit<Update, "parentId">} params - Update parameters
 * @returns {OptimisticReturn} Submission state and controls
 *
 * @example
 * ```tsx
 * const { submit, isPending } = useUpdateComment({
 *   key: `comment-${commentId}`,
 *   intent: 'update-comment',
 *   itemId: commentId,
 *   userId: currentUser.id,
 *   content: 'Updated comment text',
 *   toastMessage: 'Comment updated successfully'
 * });
 * ```
 */
export function useUpdateComment(
  params: Omit<Update, "parentId">,
): OptimisticReturn {
  return useOptimisticSubmit({
    key: params.key,
    intent: params.intent,
    toastMessage: params.toastMessage,
    data: {
      content: params.content,
      itemId: params.itemId,
      userId: params.userId,
    },
  });
}
