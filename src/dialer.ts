import Signaler, { SessionLeftEvent } from "./signaler";

export class MessageReceivedEvent extends Event {
  constructor(public sender: string, public data: string) {
    super("message_received");
  }
}

export class AuthorizationRequestedEvent extends Event {
  constructor(public sender: string, public resolve: Function, public reject: Function) {
    super("authorization_requested");
  }
}

export class ConnectionEvent extends Event {
  constructor(kind: string) {
    super(`connection_${kind}`)
  }
}

export class ConnectionClosedEvent extends ConnectionEvent {
  constructor() {
    super('closed');
  }
}
export class ConnectionReadyEvent extends ConnectionEvent {
  constructor() {
    super('ready');
  }
}


export class Conn extends EventTarget {
  private conn: RTCPeerConnection;
  private chan: RTCDataChannel;
  constructor(private signaler: Signaler, private id: string, private remoteId: string) {
    super();
    this.signaler = signaler;
    this.id = id;
    this.remoteId = remoteId;
    const defaults = {
      config: {
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
        ]
      },
      debug: 3,
    };
    this.conn = new RTCPeerConnection(defaults.config);
    this.conn.ondatachannel = (event) => {
      event.channel.onerror = (err) => {
        console.error(err)
        this.dispatchEvent(new ConnectionClosedEvent())
      }
      event.channel.onclose = (err) => {
        this.dispatchEvent(new ConnectionClosedEvent())
      }
      event.channel.onopen = () => {
        this.dispatchEvent(new ConnectionReadyEvent())
      };
      event.channel.onmessage = (msg) => {
        this.dispatchEvent(new MessageReceivedEvent(this.remoteId, msg.data));
      };
    };
    this.conn.onicecandidate = (event) => {
      if (event.candidate) {
        this.signaler.signalCandidate(this.remoteId, event.candidate);
      }
    };
    this.chan = this.conn.createDataChannel(`io.pushr.channels.send.${id}-${remoteId}`);

  }
  async init() {
    const desc = await this.conn.createOffer();
    this.conn.setLocalDescription(desc);
    console.debug(this.remoteId, 'sending description')
    return this.signaler.sendDescription(this.remoteId, desc);
  }
  close() {
    this.chan.close();
  }
  async ready(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.chan.readyState === "open") {
        resolve();
        return
      }
      let success: EventListener, failure: EventListener;

      success = () => { this.removeEventListener('connection_closed', failure); resolve() };
      failure = () => { this.removeEventListener('connection_ready', success); reject() };

      console.debug('waiting for conn to be ready. current state is', this.chan.readyState)
      this.addEventListener('connection_ready', success, { once: true });
      this.addEventListener('connection_closed', failure, { once: true });

    });
  }
  async addIceCandidate(candidate: RTCIceCandidate | RTCIceCandidateInit) {
    if (candidate !== null) {
      console.debug(this.remoteId, 'received ice candidate', candidate)
      try {
        await this.conn.addIceCandidate(candidate);
      } catch (err) {
        console.error("failed to add remote ICE candidate:", err)
      }
    }
  }
  async informOffer(desc: RTCSessionDescriptionInit) {
    console.debug(this.remoteId, 'received remote description', desc)
    this.conn.setRemoteDescription(desc);
    const answer = await this.conn.createAnswer();
    this.conn.setLocalDescription(answer);
    console.debug(this.remoteId, 'description exchange complete')
    return answer;
  }
  offerCallback(desc: RTCSessionDescriptionInit) {
    this.conn.setRemoteDescription(desc);
    console.debug(this.remoteId, 'description exchange complete')
  }
  send(message: string) {
    return this.chan.send(message);
  }
}

interface establishedConn {
  to: string;
  from: string;
  conn: Conn;
}

export class Dialer extends EventTarget {
  private registered = false;
  private conns: establishedConn[];

  constructor(private signaler: Signaler, private id: string) {
    super();
    this.signaler = signaler;
    this.conns = [];
    this.id = id;
  }
  register() {
    this.signaler.register(this);
    this.signaler.addEventListener('session_left', ((event: SessionLeftEvent) => {
      this.removeConn(event.id);
    }) as EventListener)
    this.registered = true;
  }
  async confirmOffer(from: string, desc: RTCSessionDescriptionInit) {
    const conn = new Conn(this.signaler, this.id, from);
    conn.addEventListener('connection_closed', (() => {
      this.removeConn(from);
    }) as EventListener);

    conn.addEventListener("message_received", ((event: MessageReceivedEvent) => {
      this.dispatchEvent(new MessageReceivedEvent(event.sender, event.data))
    }) as EventListener);

    this.conns.push({ from: from, to: this.id, conn: conn });
    return conn.informOffer(desc);
  }
  async informOffer(from: string, desc: RTCSessionDescriptionInit) {
    let establishedConn = this.conns.find(elt => elt.from === from);
    if (establishedConn !== undefined) { return }
    try {
      await new Promise((resolve, reject) => {
        this.dispatchEvent(new AuthorizationRequestedEvent(from, resolve, reject));
      })
      return this.confirmOffer(from, desc);
    } catch {
      throw new Error('permission denied')
    }
  }
  descriptionCallback(from: string, desc: RTCSessionDescriptionInit) {
    this.conns
      .filter((elt) => elt.to === from)
      .forEach((elt) => {
        elt.conn.offerCallback(desc);
      });
  }
  removeConn(to: string) {
    let idx = this.conns.findIndex(elt => elt.to === to);
    if (idx < 0) { return }
    this.conns[idx].conn.close();
    this.conns.splice(idx, 1);

    idx = this.conns.findIndex(elt => elt.from === to);
    if (idx < 0) { return }
    this.conns[idx].conn.close();
    this.conns.splice(idx, 1);

    console.debug(`removed connection to ${to}`)
  }
  async addIceCandidate(from: string, candidate: RTCIceCandidate | RTCIceCandidateInit) {
    return Promise.all(this.conns
      .filter((elt) => elt.to === from)
      .map(elt => elt.conn.addIceCandidate(candidate)));
  }
  async dial(remoteId: string) {
    if (!this.registered) {
      throw new Error("dialer not registered")
    }
    let establishedConn = this.conns.find(elt => elt.to === remoteId);
    if (establishedConn !== undefined) { return establishedConn.conn }
    console.debug('conn to', remoteId, 'not found: dialing a new one')
    const c = new Conn(this.signaler, this.id, remoteId);
    this.conns.push({ from: this.id, to: remoteId, conn: c });
    c.addEventListener('connection_closed', (() => {
      this.removeConn(remoteId);
    }) as EventListener);
    await c.init();
    console.debug(remoteId, 'conn init done')
    return c;
  }
}
