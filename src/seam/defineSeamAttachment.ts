export interface SeamAttachment {
  node?: string;
  governs?: string[];
  illustrates?: string[];
  defines?: string[];
  family?: string;
}

// Intentional identity helper: the value is runtime-cheap, but typed enough for
// repo-local indexing, adapter tooling, lint rules, and future graph extraction.
export function defineSeamAttachment<T extends SeamAttachment>(attachment: T): T {
  return attachment;
}
