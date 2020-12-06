import { useEffect, useState } from "react";
import { Dialer, MessageReceivedEvent } from "./dialer";
import { Payload } from "./types";

export interface FileProps {
  dialer: Dialer;
}

interface receivedFile {
  name: string;
  from: string;
  size: number;
  value: string;
  chunks: { no: number; value: string }[];
  complete: boolean;
}

export const Files = (props: FileProps) => {
  const [state, setState] = useState<receivedFile[]>([]);

  useEffect(() => {
    props.dialer.addEventListener("message_received", ((
      ev: MessageReceivedEvent
    ) => {
      try {
        const payload = JSON.parse(ev.data) as Payload;

        setState((state: receivedFile[]) => {
          const files = state.slice();
          const old = files.find(
            (elt) =>
              elt.from === ev.sender && elt.name === payload.metadata.name
          );
          if (old !== undefined) {
            if (payload.end) {
              old.value = old.chunks
                .sort((a, b) => a.no - b.no)
                .reduce((acc, cur) => acc + cur.value, "");
              old.complete = true;
            } else {
              //console.log("appending chunk", payload.chunkNumber);
              if (!old.chunks.some((elt) => elt.no === payload.chunkNumber)) {
                old.chunks = old.chunks.concat({
                  no: payload.chunkNumber,
                  value: payload.value,
                });
              }
            }
          } else {
            console.log("creating chunk", payload.chunkNumber);
            return files.concat({
              from: ev.sender,
              chunks: [{ no: payload.chunkNumber, value: payload.value }],
              value: "",
              size: payload.metadata.size,
              name: payload.metadata.name,
              complete: false,
            });
          }
          return files;
        });
      } catch (err) {
        console.log("failed:", err);
      }
    }) as EventListener);
  }, [props.dialer]);

  return (
    <div>
      Files:{" "}
      {state
        .filter((elt) => elt.complete)
        .map((elt) => (
          <a download={elt.name} href={elt.value} key={elt.from + elt.name}>
            {elt.name}
          </a>
        ))}
    </div>
  );
};
