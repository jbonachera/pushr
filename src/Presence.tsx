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
    <div>
      <div>Peers</div>
      <div className="grid">
        {sessions
          .filter((session) => session.id !== props.id)
          .sort((a, b) => a.friendlyName.localeCompare(b.friendlyName))
          .map((session) => (
            <div className="block" key={session.id}>
              <RemoteSession
                dialer={props.dialer}
                signaler={props.signaler}
                sessionId={session.id}
                friendlyName={session.friendlyName}
              />
            </div>
          ))}
      </div>
    </div>
  );
};
