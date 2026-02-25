import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { toast } from "@/hooks";

import { FileInput } from "./FileInput";

vi.mock("@/hooks", () => ({
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
    expect(screen.getByText("Drag and drop file here")).toBeInTheDocument();
  });

  it("shows valid types in hint", () => {
    render(<FileInput onChange={onChange} validTypes={validTypes} />);
    expect(screen.getByText(/image\/png, image\/jpeg/)).toBeInTheDocument();
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
      const dropZone = screen
        .getByText("Drag and drop file here")
        .closest("div[class]")!;

      fireEvent.dragOver(dropZone);

      expect(screen.getByText("Drop file here")).toBeInTheDocument();
    });

    it('hides "Drop file here" text on drag leave', () => {
      render(<FileInput onChange={onChange} validTypes={validTypes} />);
      const dropZone = document.querySelector('div[class*="bg-card"]')!;

      fireEvent.dragOver(dropZone);
      expect(screen.getByText("Drop file here")).toBeInTheDocument();

      fireEvent.dragLeave(dropZone);
      expect(screen.getByText("Drag and drop file here")).toBeInTheDocument();
    });

    it("calls onChange with valid dropped file", () => {
      render(<FileInput onChange={onChange} validTypes={validTypes} />);
      const dropZone = screen
        .getByText("Drag and drop file here")
        .closest("div[class]")!;
      const file = createFile("photo.png", "image/png");

      fireEvent.drop(dropZone, { dataTransfer: { files: [file] } });

      expect(onChange).toHaveBeenCalledWith(file);
      expect(toast).not.toHaveBeenCalled();
    });

    it("shows toast for invalid dropped file type", () => {
      render(<FileInput onChange={onChange} validTypes={validTypes} />);
      const dropZone = screen
        .getByText("Drag and drop file here")
        .closest("div[class]")!;
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
