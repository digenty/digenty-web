import { ValidationError } from "./CSVUpload";

const ROW_ERROR_PATTERN = /^Row (\d+):\s*(.*)$/;

/** Turns the upload endpoint's flat `errors: string[]` (e.g. "Row 2: class 'JSS2' not found") into ValidationError rows. */
export const parseServerRowErrors = (errors: string[]): ValidationError[] =>
  errors.map((message, index) => {
    const match = ROW_ERROR_PATTERN.exec(message);
    return match ? { row: Number(match[1]), errors: [match[2]] } : { row: index + 1, errors: [message] };
  });
