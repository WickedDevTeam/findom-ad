
// We need to fix the type definitions for the toast methods
import { type ToastProps, type ToastActionElement } from "@/components/ui/toast";
import { useState, useEffect, useCallback } from "react";

const TOAST_LIMIT = 5;
const TOAST_REMOVE_DELAY = 1000000;

type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const;

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_VALUE;
  return count.toString();
}

type ActionType = typeof actionTypes;

type Action =
  | {
      type: ActionType["ADD_TOAST"];
      toast: ToasterToast;
    }
  | {
      type: ActionType["UPDATE_TOAST"];
      toast: Partial<ToasterToast>;
    }
  | {
      type: ActionType["DISMISS_TOAST"];
      toastId?: string;
    }
  | {
      type: ActionType["REMOVE_TOAST"];
      toastId?: string;
    };

interface State {
  toasts: ToasterToast[];
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case actionTypes.ADD_TOAST:
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case actionTypes.UPDATE_TOAST:
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      };

    case actionTypes.DISMISS_TOAST: {
      const { toastId } = action;

      // ! Side effects ! - This could be extracted into a dismissToast() action,
      // but I'll keep it here for simplicity
      if (toastId) {
        if (toastTimeouts.has(toastId)) {
          clearTimeout(toastTimeouts.get(toastId));
          toastTimeouts.delete(toastId);
        }
      } else {
        for (const [id, timeout] of toastTimeouts.entries()) {
          clearTimeout(timeout);
          toastTimeouts.delete(id);
        }
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      };
    }
    case actionTypes.REMOVE_TOAST:
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        };
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
  }
};

const listeners: Array<(state: State) => void> = [];

let memoryState: State = { toasts: [] };

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

// Define the toast function with extended methods
type ToastFunction = (props: Omit<ToasterToast, "id">) => {
  id: string;
  dismiss: () => void;
  update: (props: ToasterToast) => void;
};

// Define additional methods for the toast function
interface ExtendedToastFunction extends ToastFunction {
  success: (props: Omit<ToasterToast, "id">) => ReturnType<ToastFunction>;
  error: (props: Omit<ToasterToast, "id">) => ReturnType<ToastFunction>;
  warning: (props: Omit<ToasterToast, "id">) => ReturnType<ToastFunction>;
  info: (props: Omit<ToasterToast, "id">) => ReturnType<ToastFunction>;
}

export function useToast() {
  const [state, setState] = useState<State>(memoryState);

  useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);

  const toast = useCallback(
    ({ ...props }: Omit<ToasterToast, "id">) => {
      const id = genId();

      const update = (props: ToasterToast) =>
        dispatch({
          type: actionTypes.UPDATE_TOAST,
          toast: { ...props, id },
        });
      const dismiss = () => dispatch({ type: actionTypes.DISMISS_TOAST, toastId: id });

      dispatch({
        type: actionTypes.ADD_TOAST,
        toast: {
          ...props,
          id,
          open: true,
          onOpenChange: (open) => {
            if (!open) dismiss();
          },
        },
      });

      return {
        id,
        dismiss,
        update,
      };
    },
    []
  ) as ExtendedToastFunction;

  // Add success method to toast
  toast.success = (props: Omit<ToasterToast, "id">) => {
    return toast({
      variant: "default",
      ...props,
    });
  };

  // Add error method
  toast.error = (props: Omit<ToasterToast, "id">) => {
    return toast({
      variant: "destructive",
      ...props,
    });
  };

  // Add warning method
  toast.warning = (props: Omit<ToasterToast, "id">) => {
    return toast({
      variant: "default",
      ...props,
    });
  };

  // Add info method
  toast.info = (props: Omit<ToasterToast, "id">) => {
    return toast({
      variant: "default",
      ...props,
    });
  };

  return {
    toast,
    dismiss: (toastId?: string) => dispatch({ type: actionTypes.DISMISS_TOAST, toastId }),
    toasts: state.toasts,
  };
}

// Redefine the standalone toast function with proper types
const toast = (({ ...props }: Omit<ToasterToast, "id">) => {
  const id = genId();

  const update = (props: ToasterToast) =>
    dispatch({
      type: actionTypes.UPDATE_TOAST,
      toast: { ...props, id },
    });
  const dismiss = () => dispatch({ type: actionTypes.DISMISS_TOAST, toastId: id });

  dispatch({
    type: actionTypes.ADD_TOAST,
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss();
      },
    },
  });

  return {
    id,
    dismiss,
    update,
  };
}) as ExtendedToastFunction;

// Add helper methods for different toast types
toast.success = (props) => {
  return toast({
    variant: "default",
    ...props,
  });
};

toast.error = (props) => {
  return toast({
    variant: "destructive",
    ...props,
  });
};

toast.warning = (props) => {
  return toast({
    variant: "default",
    ...props,
  });
};

toast.info = (props) => {
  return toast({
    variant: "default",
    ...props,
  });
};

export { toast };
