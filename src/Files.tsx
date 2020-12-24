import { useEffect, useState } from "react";
import { AuthorizationRequestedEvent, Dialer, MessageReceivedEvent } from "./dialer";
import { Payload } from "./types";

export interface FileProps {
  dialer: Dialer;
}

interface receivedFile {
  name: string;
  from: string;
  size: number;
  value: string;
  chunkTotalCount: number;
  chunks: { no: number; value: string }[];
  complete: boolean;
}

interface fileTransfertRequest {
  filename: string;
  allow?: () => void;
  deny?: () => void;
}

const percentage = (total: number, left: number): number =>
  total === 0 ? 100 : (((total - left) / total) * 100);

export const Files = (props: FileProps) => {
  const [receivedFiles, setReceivedFiles] = useState<receivedFile[]>([]);
  const [fileTransfertRequests, setfileTransfertRequests] = useState<fileTransfertRequest[]>([]);

  useEffect(() => {
    props.dialer.addEventListener("message_received", ((
      ev: MessageReceivedEvent
    ) => {
      try {
        const payload = JSON.parse(ev.data) as Payload;

        setReceivedFiles((state: receivedFile[]) => {
          const files = state.slice();
          const old = files.find(
            (elt) =>
              elt.from === ev.sender && elt.name === payload.metadata.name
          );
          if (old !== undefined) {
            if (old.chunkTotalCount === 0) {
              old.chunkTotalCount = payload.chunkTotalCount;
              old.chunks = [{ no: payload.chunkNumber, value: payload.value }];
              old.size = payload.metadata.size;
            } else {
              if (payload.end) {
                old.value = old.chunks
                  .sort((a, b) => a.no - b.no)
                  .reduce((acc, cur) => acc + cur.value, "");
                old.complete = true;
              } else {
                if (!old.chunks.some((elt) => elt.no === payload.chunkNumber)) {
                  old.chunks = old.chunks.concat({
                    no: payload.chunkNumber,
                    value: payload.value,
                  });
                }
              }
            }
          } else {
            return files.concat({
              from: ev.sender,
              chunkTotalCount: payload.chunkTotalCount,
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
  }, [props]);


  useEffect(() => {
    props.dialer.addEventListener("authorization_requested", ((
      ev: AuthorizationRequestedEvent
    ) => {
      setfileTransfertRequests((requests) => {
        if (requests.some((elt) => elt.filename === ev.filename)) { return requests }
        return requests.concat({
          filename: ev.filename,
          allow: () => {
            setReceivedFiles((files) => files.concat({
              from: ev.sender,
              chunkTotalCount: 0,
              chunks: [],
              complete: false,
              value: "",
              name: ev.filename,
              size: 0,
            }))
            setfileTransfertRequests([]);
            ev.resolve()
          },
          deny: () => {
            setfileTransfertRequests([]);
            ev.reject();
          },
        })
      })
    }) as EventListener);
  }, [props]);



  const authorization = (requests: fileTransfertRequest[]) =>
    requests.map((request) =>
    (<li key={request.filename}>
      {request.filename}
      <button onClick={request.allow}>Accept</button>
      <button onClick={request.deny}>Refuse</button>
    </li>)
    );



  return (
    <div>
      <div>Received Files</div>
      <div>
        <ul className="receivedFiles blockContent">
          {authorization(fileTransfertRequests)}
          {receivedFiles
            .filter((elt) => !elt.complete)
            .map((elt) => (
              <li key={elt.from + elt.name}>
                {elt.name} ({(100 - percentage(elt.chunkTotalCount, elt.chunks.length)).toFixed(2)}%)
              </li>
            ))}
          {receivedFiles
            .filter((elt) => elt.complete)
            .map((elt) => (
              <li key={elt.from + elt.name}>
                <a download={elt.name} href={elt.value}>
                  {elt.name}
                </a>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};
