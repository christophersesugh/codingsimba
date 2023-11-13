type Response<T> = {
  ok: boolean;
  data: T | undefined; // Initialize as undefined
  error: any;
};

function response<T>({
  ok = true,
  data,
  error = null,
}: Partial<Response<T>> = {}): Response<T> {
  return {
    ok,
    data: data === undefined ? undefined : data, // Check for undefined
    error: error
      ? error?.message
        ? { message: error.message }
        : { message: "an error occurred, try again." }
      : null,
  };
}

export { response };
