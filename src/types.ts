export class Payload {
  constructor(
    public chunkNumber: number,
    public metadata: Metadata,
    public value: string,
    public end: boolean,
  ) { }
}

export interface Metadata {
  name: string;
  size: number;
}
