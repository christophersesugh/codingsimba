import React from "react";
import { ContentIntentSchema } from "~/routes/articles/article";
import { useFetcher } from "react-router";
import { z } from "zod";

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
  /** The data payload for the operation */
  data: DataConstraintSchema,
  /** The type of content operation to perform */
  intent: ContentIntentSchema,
});

/**
 * Schema for content update operations.
 * Defines the structure of data for updating content.
 */
export const UpdateSchema = z.object({
  /** The type of content operation to perform */
  intent: ContentIntentSchema,
  /** ID of the parent content (if applicable) */
  parentId: z.string().optional(),
  /** ID of the content being operated on */
  itemId: z.string(),
  /** ID of the user performing the operation (if applicable) */
  userId: z.string(),
  /** The content text (if applicable) */
  body: z.string().optional(),
});

export type OptimisticSubmit = z.infer<typeof OptimisticSubmitSchema>;
export type Update = z.infer<typeof UpdateSchema>;

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
function useOptimisticSubmit({ data, intent }: OptimisticSubmit) {
  const fetcher = useFetcher({ key: intent });

  const submit = React.useCallback(() => {
    try {
      const parsed = OptimisticSubmitSchema.parse({
        data,
        intent,
      });
      fetcher.submit({ ...parsed.data, intent }, { method: "post" });
    } catch (err) {
      console.error(err);
    }
    // Remove fetcher from deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, intent]);

  return {
    submit,
    isPending: fetcher.state === "submitting",
    error: fetcher.data?.error || null,
  };
}

/**
 * Hook for creating new content (comments, replies)
 * @param params - Creation parameters including itemId, parentId (optional), userId, intent, and body
 * @returns Object containing submit function, isPending state, and error state
 *
 * @example
 * ```tsx
 * const { submit, isPending } = useCreate({
 *   itemId: commentId,
 *   parentId: parentCommentId, // optional
 *   userId: currentUser.id,
 *   intent: "add-reply",
 *   body: "Reply content"
 * });
 * ```
 */
export function useCreate(params: Update): OptimisticReturn {
  return useOptimisticSubmit({
    intent: params.intent,
    data: {
      body: params.body,
      parentId: params.parentId,
      itemId: params.itemId,
      userId: params.userId,
    },
  });
}

/**
 * Hook for handling content upvoting (comments, replies, articles)
 * @param params - Upvote parameters including itemId, userId, and intent
 * @returns Object containing submit function, isPending state, and error state
 *
 * @example
 * ```tsx
 * const { submit, isPending } = useUpvote({
 *   itemId: commentId,
 *   userId: currentUser.id,
 *   intent: "upvote-comment"
 * });
 * ```
 */
export function useUpvote(
  params: Omit<Update, "content" | "parentId">,
): OptimisticReturn {
  return useOptimisticSubmit({
    intent: params.intent,
    data: {
      itemId: params.itemId,
      userId: params.userId,
    },
  });
}

/**
 * Hook for deleting content (comments, replies)
 * @param params - Deletion parameters including itemId, userId, and intent
 * @returns Object containing submit function, isPending state, and error state
 *
 * @example
 * ```tsx
 * const { submit, isPending } = useDelete({
 *   itemId: commentId,
 *   userId: currentUser.id,
 *   intent: "delete-comment"
 * });
 * ```
 */
export function useDelete(
  params: Omit<Update, "content" | "parentId">,
): OptimisticReturn {
  return useOptimisticSubmit({
    intent: params.intent,
    data: {
      itemId: params.itemId,
      userId: params.userId,
    },
  });
}

/**
 * Hook for updating content (comments, replies)
 * @param params - Update parameters including itemId, userId, intent, and body
 * @returns Object containing submit function, isPending state, and error state
 *
 * @example
 * ```tsx
 * const { submit, isPending } = useUpdate({
 *   itemId: commentId,
 *   userId: currentUser.id,
 *   intent: "update-comment",
 *   body: "Updated content"
 * });
 * ```
 */
export function useUpdate(params: Omit<Update, "parentId">): OptimisticReturn {
  return useOptimisticSubmit({
    intent: params.intent,
    data: {
      body: params.body,
      itemId: params.itemId,
      userId: params.userId,
    },
  });
}
