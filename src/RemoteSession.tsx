import React, { useEffect, useState } from "react";
import { Conn, Dialer, } from "./dialer";
import { Metadata, Payload } from "./types";
import Signaler from './signaler';

export interface RemoteSessionProps {
  sessionId: string;
  friendlyName: string;
  dialer: Dialer;
  signaler: Signaler;
}


const chunkSize = 1000;
interface progressState {
  conn?: Conn;
  value: string;
  metadata: Metadata;
  chunkNumber: number;
  total: number;
}


const percentage = (total: number, left: number): number =>
  total === 0 ? 100 : (((total - left) / total) * 100);

const encodeBlob = (blob: Blob): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = function (e) {
      if (reader.result) {
        resolve(reader.result.toString());
      }
    };
    reader.readAsDataURL(blob);
  });
};


export const RemoteSession = (props: RemoteSessionProps) => {
  const [filename, setFilename] = useState<string>("");
  const [progress, setProgress] = useState(0);
  const [progressState, setProgressState] = useState<progressState>({
    chunkNumber: 0,
    conn: undefined,
    metadata: { name: "", size: 0 },
    total: 0,
    value: "",
  });


  const handleSubmit = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(e.target.files);
  };


  const handleChange = async (files: FileList | null) => {
    if (files === null || files.length === 0) {
      setFilename("");
      setProgress(0);
      return;
    }
    const file = files[0];
    setFilename(file.name);
    await send({ name: file.name, size: file.size }, file);
  };
  useEffect(() => {
    if (!progressState.conn) { return }
    setProgress(percentage(progressState.total, progressState.value.length));
    if (progressState.value.length === 0) {
      progressState.conn.send(
        JSON.stringify(
          new Payload(
            progressState.chunkNumber,
            progressState.total / chunkSize,
            progressState.metadata,
            "",
            true
          )
        )
      );
      console.log("send complete");
      progressState.conn.close()
      return;
    }
    const chunk = progressState.value.slice(0, chunkSize);
    progressState.conn.send(
      JSON.stringify(
        new Payload(
          progressState.chunkNumber,
          progressState.total / chunkSize,
          progressState.metadata,
          chunk,
          false
        )
      )
    );
    setProgressState((state) => ({
      chunkNumber: state.chunkNumber + 1,
      conn: state.conn,
      metadata: state.metadata,
      value: state.value.slice(chunk.length),
      total: state.total,
    }));
  }, [progressState]);

  const send = async (metadata: Metadata, data: Blob) => {
    const conn = await props.dialer.dial(props.sessionId, metadata.name);
    await conn.ready();
    const b64 = await encodeBlob(data);
    setProgressState({
      chunkNumber: 0,
      conn: conn,
      metadata: metadata,
      value: b64,
      total: b64.length,
    });
  };



  return (
    <button className="sessionIcon"    >
      <label htmlFor={props.sessionId}>
        {props.friendlyName}
        {filename !== "" && progress < 100 ? (
          <div>
            {filename} ({progress.toFixed(2)}%)
          </div>
        ) : null}
        <input
          type="file"
          className="remote-session-input"
          id={props.sessionId}
          onChange={handleSubmit}
        />
      </label>
    </button>
  );
};
