export interface FieldEventOptions {
  /** Opt in to forwarding handlers previously overridden by React Hook Form. Default false preserves each component's legacy callbacks. */
  forwardEvents?: boolean;
}

export interface TextFieldOptions extends FieldEventOptions {
  /** Trim on blur as in previous versions. Set false to preserve the exact input. Default true. */
  trimOnBlur?: boolean;
}
