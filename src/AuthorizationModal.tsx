import { useEffect, useState } from "react";
import { AuthorizationRequestedEvent, Dialer } from "./dialer";
import Signaler from "./signaler";

export interface AuthorizationModalProps {
  dialer: Dialer;
  signaler: Signaler;
}
interface state {
  show: Boolean;
  from?: string;
  allow?: () => void;
  deny?: () => void;
}

export const AuthorizationModal = (props: AuthorizationModalProps) => {
  const [state, setState] = useState<state>({ show: false });

  useEffect(() => {
    props.dialer.addEventListener("authorization_requested", ((
      ev: AuthorizationRequestedEvent
    ) => {
      console.log(`${ev.sender} requested authorization`);
      setState(() => ({
        show: true,
        allow: () => {
          setState({ show: false });
          ev.resolve();
        },
        deny: () => {
          setState({ show: false });
          ev.reject();
        },
        from: props.signaler.getPeer(ev.sender).name,
      }));
    }) as EventListener);
  }, [props]);

  return !state.show ? null : (
    <div className="modal-overlay">
      <div className="modal">
        <div>{state.from} requested authorization.</div>
        <div>
          <button onClick={state.allow}>Allow</button>
          <button onClick={state.deny}>Deny</button>
        </div>
      </div>
    </div>
  );
};
