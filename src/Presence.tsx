import { useEffect, useState } from "react";
import { Dialer } from "./dialer";
import { RemoteSession } from "./RemoteSession";
import Signaler, { SessionJoinedEvent, SessionLeftEvent } from "./signaler";

export interface PresenceProps {
  id: string;
  friendlyName: string;
  dialer: Dialer;
  signaler: Signaler;
}
interface session {
  id: string;
  friendlyName: string;
}
export const Presence = (props: PresenceProps) => {
  const [sessions, setSessions] = useState<session[]>([]);
  useEffect(() => {
    props.signaler.addEventListener("session_joined", ((
      ev: SessionJoinedEvent
    ) => {
      console.debug("session", ev.id, "joined");
      setSessions((sessions) => {
        if (!sessions.some((elt) => elt.id === ev.id)) {
          return sessions.concat({ id: ev.id, friendlyName: ev.friendlyName });
        }
        return sessions;
      });
    }) as EventListener);

    props.signaler.addEventListener("session_left", ((ev: SessionLeftEvent) => {
      console.debug("session", ev.id, "left");
      setSessions((sessions) => sessions.filter((elt) => elt.id !== ev.id));
    }) as EventListener);
  }, [props]);

  return (
    <div className="presence">
      {sessions
        .filter((session) => session.id !== props.id)
        .map((session) => (
          <RemoteSession
            key={session.id}
            dialer={props.dialer}
            sessionId={session.id}
            friendlyName={session.friendlyName}
          />
        ))}
    </div>
  );
};
