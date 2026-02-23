import { describe, expect, it } from "vitest";

import { reducer } from "./useToast";

const makeToast = (id: string) => ({
  id,
  title: `Toast ${id}`,
  open: true,
});

const initialState = { toasts: [] };

describe("reducer", () => {
  describe("ADD_TOAST", () => {
    it("adds a toast to empty state", () => {
      const toast = makeToast("1");
      const state = reducer(initialState, { type: "ADD_TOAST", toast });
      expect(state.toasts).toHaveLength(1);
      expect(state.toasts[0]).toEqual(toast);
    });

    it("prepends new toast to existing toasts", () => {
      const first = makeToast("1");
      const second = makeToast("2");

      let state = reducer(initialState, { type: "ADD_TOAST", toast: first });
      state = reducer(state, { type: "ADD_TOAST", toast: second });

      expect(state.toasts[0]).toEqual(second);
    });

    it("respects TOAST_LIMIT of 1", () => {
      const first = makeToast("1");
      const second = makeToast("2");

      let state = reducer(initialState, { type: "ADD_TOAST", toast: first });
      state = reducer(state, { type: "ADD_TOAST", toast: second });

      expect(state.toasts).toHaveLength(1);
      expect(state.toasts[0]).toEqual(second);
    });
  });

  describe("UPDATE_TOAST", () => {
    it("updates existing toast by id", () => {
      const toast = makeToast("1");
      let state = reducer(initialState, { type: "ADD_TOAST", toast });

      state = reducer(state, {
        type: "UPDATE_TOAST",
        toast: { id: "1", title: "Updated title" },
      });

      expect(state.toasts[0].title).toBe("Updated title");
    });

    it("does not update toast with wrong id", () => {
      const toast = makeToast("1");
      let state = reducer(initialState, { type: "ADD_TOAST", toast });

      state = reducer(state, {
        type: "UPDATE_TOAST",
        toast: { id: "999", title: "Updated title" },
      });

      expect(state.toasts[0].title).toBe("Toast 1");
    });
  });

  describe("DISMISS_TOAST", () => {
    it("sets open to false for specific toast", () => {
      const toast = makeToast("1");
      let state = reducer(initialState, { type: "ADD_TOAST", toast });

      state = reducer(state, { type: "DISMISS_TOAST", toastId: "1" });

      expect(state.toasts[0].open).toBe(false);
    });

    it("sets open to false for all toasts when toastId is undefined", () => {
      const first = makeToast("1");
      let state = reducer(initialState, { type: "ADD_TOAST", toast: first });

      state = reducer(state, { type: "DISMISS_TOAST" });

      expect(state.toasts.every((t) => t.open === false)).toBe(true);
    });

    it("does not remove toast, only closes it", () => {
      const toast = makeToast("1");
      let state = reducer(initialState, { type: "ADD_TOAST", toast });

      state = reducer(state, { type: "DISMISS_TOAST", toastId: "1" });

      expect(state.toasts).toHaveLength(1);
    });
  });

  describe("REMOVE_TOAST", () => {
    it("removes specific toast by id", () => {
      const toast = makeToast("1");
      let state = reducer(initialState, { type: "ADD_TOAST", toast });

      state = reducer(state, { type: "REMOVE_TOAST", toastId: "1" });

      expect(state.toasts).toHaveLength(0);
    });

    it("removes all toasts when toastId is undefined", () => {
      const toast = makeToast("1");
      let state = reducer(initialState, { type: "ADD_TOAST", toast });

      state = reducer(state, { type: "REMOVE_TOAST" });

      expect(state.toasts).toHaveLength(0);
    });

    it("does not remove toast with wrong id", () => {
      const toast = makeToast("1");
      let state = reducer(initialState, { type: "ADD_TOAST", toast });

      state = reducer(state, { type: "REMOVE_TOAST", toastId: "999" });

      expect(state.toasts).toHaveLength(1);
    });
  });
});
