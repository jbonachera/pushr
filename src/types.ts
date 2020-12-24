export class Payload {
  constructor(
    public chunkNumber: number,
    public chunkTotalCount: number,
    public metadata: Metadata,
    public value: string,
    public end: boolean,
  ) { }
}

export interface Offer {
  desc: RTCSessionDescriptionInit;
  filename: string
};

export interface Metadata {
  name: string;
  size: number;
}
