const INTERNAL_ERROR_MESSAGE = "Something went wrong!";

const getErrorMessage = (error: unknown): string => {
  let message = INTERNAL_ERROR_MESSAGE;

  if (error instanceof Error) {
    message = error.message;
  } else if (error && typeof error === "object") {
    if ("message" in error) {
      message = String(error.message);
    } else if ("errors" in error) {
      const errorObj = error as { errors: Record<string, string[]> };
      const firstErrorMessages = Object.values(errorObj.errors)[0];
      if (Array.isArray(firstErrorMessages) && firstErrorMessages.length > 0) {
        message = firstErrorMessages[0];
      }
    }
  } else if (typeof error === "string") {
    message = error;
  }

  return message;
};

export { getErrorMessage };
