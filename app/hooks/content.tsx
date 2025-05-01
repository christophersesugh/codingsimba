// import { useFetcher } from "react-router";
// import { toast } from "sonner";
// import { getErrorMessage } from "~/utils/misc";

// type OptimisticSubmit = {
//   key: string;
// };

// const noop = () => () => {};

// function useOptimisticSubmit({
//   key,
//   data = {},
//   intent,
//   toastMessage,
// }: {
//   key: string;
//   data: object;
//   intent: string;
//   toastMessage?: string;
// }) {
//   const fetcher = useFetcher({ key });
//   fetcher
//     .submit({ ...data, intent }, { method: "post" })
//     .then(() => (toastMessage ? toast(toastMessage) : noop()))
//     .catch((error) => toast(getErrorMessage(error)));
// }

// export function useSubmitComment({
//   key,
//   intent,
//   itemId,
//   userId,
//   content,
// }: {
//   key: string;
//   intent: string;
//   itemId: string;
//   userId: string;
//   content: string;
// }) {
//   return useOptimisticSubmit({
//     key,
//     intent,
//     data: { content, itemId, userId },
//   });
// }
// export function useContentUpvote({
//   key,
//   intent,
//   itemId,
//   userId,
// }: {
//   key: string;
//   intent: string;
//   itemId: string;
//   userId: string;
// }) {
//   return useOptimisticSubmit({ key, intent, data: { itemId, userId } });
// }
// export function useDeleteComment({
//   key,
//   intent,
//   itemId,
//   userId,
// }: {
//   key: string;
//   intent: string;
//   itemId: string;
//   userId: string;
// }) {
//   return useOptimisticSubmit({ key, intent, data: { itemId, userId } });
// }
// export function useUpdateComment({
//   key,
//   intent,
//   itemId,
//   userId,
//   content,
// }: {
//   key: string;
//   intent: string;
//   itemId: string;
//   userId: string;
//   content: string;
// }) {
//   return useOptimisticSubmit({
//     key,
//     intent,
//     data: { content, itemId, userId },
//   });
// }
