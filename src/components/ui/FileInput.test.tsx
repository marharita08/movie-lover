import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { en } from "@/const/translations/en";
import { toast } from "@/hooks";

import { FileInput } from "./FileInput";

vi.mock("@/hooks", () => ({
  useTranslation: () => ({ t: (k: keyof typeof en) => en[k] || k }),
  toast: vi.fn(),
}));

const createFile = (name: string, type: string) =>
  new File(["content"], name, { type });

describe("FileInput", () => {
  const onChange = vi.fn();
  const validTypes = ["image/png", "image/jpeg"];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders drop zone", () => {
    render(<FileInput onChange={onChange} validTypes={validTypes} />);
    expect(screen.getByTestId("drag-text")).toBeInTheDocument();
  });

  it("shows valid types in hint", () => {
    render(<FileInput onChange={onChange} validTypes={validTypes} />);
    expect(screen.getByTestId("file-types")).toHaveTextContent(
      /image\/png, image\/jpeg/,
    );
  });

  describe("handleChange", () => {
    it("calls onChange with valid file", () => {
      render(<FileInput onChange={onChange} validTypes={validTypes} />);
      const input = document.querySelector(
        'input[type="file"]',
      ) as HTMLInputElement;
      const file = createFile("photo.png", "image/png");

      fireEvent.change(input, { target: { files: [file] } });

      expect(onChange).toHaveBeenCalledWith(file);
      expect(toast).not.toHaveBeenCalled();
    });

    it("shows toast for invalid file type", () => {
      render(<FileInput onChange={onChange} validTypes={validTypes} />);
      const input = document.querySelector(
        'input[type="file"]',
      ) as HTMLInputElement;
      const file = createFile("doc.pdf", "application/pdf");

      fireEvent.change(input, { target: { files: [file] } });

      expect(onChange).not.toHaveBeenCalled();
      expect(toast).toHaveBeenCalledWith({
        variant: "destructive",
        title: "Invalid file type",
      });
    });

    it("does nothing if no file selected", () => {
      render(<FileInput onChange={onChange} validTypes={validTypes} />);
      const input = document.querySelector(
        'input[type="file"]',
      ) as HTMLInputElement;

      fireEvent.change(input, { target: { files: [] } });

      expect(onChange).not.toHaveBeenCalled();
      expect(toast).not.toHaveBeenCalled();
    });
  });

  describe("drag and drop", () => {
    it('shows "Drop file here" text when dragging over', () => {
      render(<FileInput onChange={onChange} validTypes={validTypes} />);
      const dropZone = screen.getByTestId("file-dropzone");

      fireEvent.dragOver(dropZone);

      expect(screen.getByTestId("drop-text")).toBeInTheDocument();
    });

    it('hides "Drop file here" text on drag leave', () => {
      render(<FileInput onChange={onChange} validTypes={validTypes} />);
      const dropZone = screen.getByTestId("file-dropzone");

      fireEvent.dragOver(dropZone);
      expect(screen.getByTestId("drop-text")).toBeInTheDocument();

      fireEvent.dragLeave(dropZone);
      expect(screen.getByTestId("drag-text")).toBeInTheDocument();
    });

    it("calls onChange with valid dropped file", () => {
      render(<FileInput onChange={onChange} validTypes={validTypes} />);
      const dropZone = screen.getByTestId("file-dropzone");
      const file = createFile("photo.png", "image/png");

      fireEvent.drop(dropZone, { dataTransfer: { files: [file] } });

      expect(onChange).toHaveBeenCalledWith(file);
      expect(toast).not.toHaveBeenCalled();
    });

    it("shows toast for invalid dropped file type", () => {
      render(<FileInput onChange={onChange} validTypes={validTypes} />);
      const dropZone = screen.getByTestId("file-dropzone");
      const file = createFile("doc.pdf", "application/pdf");

      fireEvent.drop(dropZone, { dataTransfer: { files: [file] } });

      expect(onChange).not.toHaveBeenCalled();
      expect(toast).toHaveBeenCalledWith({
        variant: "destructive",
        title: "Invalid file type",
      });
    });
  });
});
