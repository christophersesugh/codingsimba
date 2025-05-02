import React from "react";
import { useFetcher } from "react-router";
import { toast } from "sonner";
import { z } from "zod";
import { getErrorMessage } from "~/utils/misc";

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

export const DataConstraintSchema = z.record(z.unknown());

// type DataConstraint = z.infer<typeof DataConstraintSchema>;

export const OptimisticSubmitSchema = z.object({
  key: z.string().optional(),
  data: DataConstraintSchema,
  intent: ContentIntentSchema,
  toastMessage: z.string().optional(),
});

export const UpdateSchema = z.object({
  key: z.string().optional(),
  intent: ContentIntentSchema,
  parentId: z.string().nullable(),
  itemId: z.string().nullable(),
  userId: z.string(),
  content: z.string().min(1).optional(),
  toastMessage: z.string().optional(),
});

type OptimisticSubmit = z.infer<typeof OptimisticSubmitSchema>;
type Update = z.infer<typeof UpdateSchema>;

/** Return type from optimistic hooks */
type OptimisticReturn = {
  /** submission trigger */
  submit: () => void;
  /** True during submission */
  isPending: boolean;
  /** Error object if submission failed */
  error: Error | null;
};

/**
 * Base hook for optimistic content operations
 * @template T - Data payload type
 * @param {OptimisticSubmit<T>} params - Submission parameters
 * @returns {OptimisticReturn} Operation state
 *
 * @example
 * const { isPending, error } = useOptimisticSubmit({
 *   key: 'comment-123',
 *   intent: 'add-comment',
 *   data: { content: 'Hello world' },
 *   toastMessage: 'Comment posted!'
 * });
 */
function useOptimisticSubmit({
  key,
  data,
  intent,
  toastMessage,
}: OptimisticSubmit): OptimisticReturn {
  const fetcher = useFetcher({ key: key ? key : intent });
  const submit = React.useCallback(() => {
    try {
      const parsed = OptimisticSubmitSchema.parse({
        key,
        data,
        intent,
        toastMessage,
      });
      fetcher
        .submit({ ...parsed.data, intent }, { method: "post" })
        .then(() => toastMessage && toast(toastMessage))
        .catch((error) => {
          const message =
            error.status === 401
              ? "Authentication required"
              : getErrorMessage(error);
          toast(message);
        });
    } catch (err) {
      toast("Invalid request data");
      console.error(err);
    }
  }, [key, data, intent, toastMessage, fetcher]);

  return {
    submit,
    isPending: fetcher.state === "submitting",
    error: fetcher.data?.error || null,
  };
}

/**
 * Handles comment submission with optimistic updates
 * @param {Update} params - Comment parameters
 * @returns {OptimisticReturn} Submission state
 *
 * @example
 * const { isPending } = useSubmitComment({
 *   key: `post-${postId}-comments`,
 *   intent: 'add-comment',
 *   itemId: postId,
 *   userId: currentUser.id,
 *   content: 'Great post!'
 * });
 */
export function useSubmitComment(params: Update): OptimisticReturn {
  const memoizedParams = React.useMemo(
    () => ({
      key: params.key,
      intent: params.intent,
      toastMessage: params.toastMessage,
      data: {
        content: params.content,
        parentId: params.parentId,
        itemId: params.itemId,
        userId: params.userId,
      },
    }),
    [
      params.key,
      params.intent,
      params.toastMessage,
      params.content,
      params.parentId,
      params.itemId,
      params.userId,
    ],
  );

  return useOptimisticSubmit(memoizedParams);
}

/**
 * Handles content upvoting with optimistic UI
 * @param {Omit<Update, "content" | "parentId">} params - Upvote parameters
 * @returns {OptimisticReturn} Submission state
 *
 * @example
 * const { isPending } = useContentUpvote({
 *   key: `post-${postId}-upvotes`,
 *   intent: isUpvoted ? 'remove-upvote' : 'upvote-comment',
 *   itemId: postId,
 *   userId: currentUser.id
 * });
 */
export function useContentUpvote(
  params: Omit<Update, "content" | "parentId">,
): OptimisticReturn {
  const memoizedParams = React.useMemo(
    () => ({
      key: params.key,
      intent: params.intent,
      toastMessage: params.toastMessage,
      data: {
        itemId: params.itemId,
        userId: params.userId,
      },
    }),
    [
      params.key,
      params.intent,
      params.toastMessage,
      params.itemId,
      params.userId,
    ],
  );

  return useOptimisticSubmit(memoizedParams);
}

/**
 * Handles comment deletion with optimistic UI
 * @param {Omit<Update, "content" | "parentId">} params - Deletion parameters
 * @returns {OptimisticReturn} Submission state
 *
 * @example
 * const { error } = useDeleteComment({
 *   key: `comment-${commentId}`,
 *   intent: 'delete-comment',
 *   itemId: commentId,
 *   userId: currentUser.id
 * });
 */
export function useDeleteComment(
  params: Omit<Update, "content" | "parentId">,
): OptimisticReturn {
  const memoizedParams = React.useMemo(
    () => ({
      key: params.key,
      intent: params.intent,
      toastMessage: params.toastMessage,
      data: {
        itemId: params.itemId,
        userId: params.userId,
      },
    }),
    [
      params.key,
      params.intent,
      params.toastMessage,
      params.itemId,
      params.userId,
    ],
  );

  return useOptimisticSubmit(memoizedParams);
}

/**
 * Handles comment updates with optimistic UI
 * @param {Omit<Update, "parentId">} params - Update parameters
 * @returns {OptimisticReturn} Submission state
 *
 * @example
 * const { isPending } = useUpdateComment({
 *   key: `comment-${commentId}`,
 *   intent: 'update-comment',
 *   itemId: commentId,
 *   userId: currentUser.id,
 *   content: 'Updated comment text'
 * });
 */
export function useUpdateComment(
  params: Omit<Update, "parentId">,
): OptimisticReturn {
  const memoizedParams = React.useMemo(
    () => ({
      key: params.key,
      intent: params.intent,
      toastMessage: params.toastMessage,
      data: {
        content: params.content,
        itemId: params.itemId,
        userId: params.userId,
      },
    }),
    [
      params.key,
      params.intent,
      params.toastMessage,
      params.content,
      params.itemId,
      params.userId,
    ],
  );
  return useOptimisticSubmit(memoizedParams);
}
