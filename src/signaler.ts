import mqtt from "mqtt";

const qosLevel = 2;

export class SessionEvent extends Event {
  id: string;
  constructor(kind: string, id: string) {
    super(`session_${kind}`);
    this.id = id;
  }
}

export class SessionJoinedEvent extends SessionEvent {
  friendlyName: string;
  constructor(id: string, friendlyName: string) {
    super("joined", id);
    this.friendlyName = friendlyName;
  }
}
export class SessionLeftEvent extends SessionEvent {
  constructor(id: string) {
    super("left", id);
  }
}

interface session {
  id: string;
  name: string;
}
export default class Signaler extends EventTarget {
  private dialer: any;
  private mqtt: mqtt.MqttClient;
  private sessions: session[] = [];

  close() {
    this.mqtt.end(true);
  }
  getPeer(id: string): session {
    const v = this.sessions.find(elt => elt.id === id)
    if (v === undefined) { return { id: id, name: ' Unknown' } }
    return v;
  }
  constructor(private id: string, private name: string) {
    super();
    const mqttPresencePrefix = `sessions/`;
    // chrome refuses to connect without this, I do not understand why.
    try { fetch("https://broker.iot.cloud.vx-labs.net/mqtt") } catch { }
    this.mqtt = mqtt.connect("wss://broker.iot.cloud.vx-labs.net/mqtt", {
      username: "julien@bonachera.fr/pushr/browser",
      password: "VeryPasswordMuchSecureWow",
      connectTimeout: 30 * 1000,
      clean: true,
      resubscribe: false,
      clientId: `pushr_${id}`,
      will: {
        retain: true,
        payload: '',
        qos: qosLevel,
        topic: `sessions/${this.id}`,
      },
    });
    this.mqtt.on("message", (topic, payload) => {
      //console.debug(`${topic} -> ${payload.toString()}`);
      if (topic.startsWith(mqttPresencePrefix)) {
        topic = topic.slice(mqttPresencePrefix.length);
        const tokens = topic.split("/");
        if (tokens.length === 1) {
          const sessionId = tokens[0];
          if (payload.length === 0) {
            if (this.sessions.some(elt => elt.id === sessionId)) {
              this.sessions = this.sessions.filter(elt => elt.id !== sessionId)
            }
            this.dispatchEvent(new SessionLeftEvent(sessionId));
          } else {
            const input = JSON.parse(payload.toString())
            if (!this.sessions.some(elt => elt.id === sessionId)) {
              this.sessions.push({ id: sessionId, name: input.name })
            }
            this.dispatchEvent(new SessionJoinedEvent(sessionId, input.name));
          }
        } else if (topic.startsWith(this.id)) {
          // RPC
          if (this.dialer === undefined) {
            console.error('dropped packet: dialer not registered')
            return;
          }
          topic = topic.slice(this.id.length + 1);
          switch (topic) {
            case "candidate":
              {
                const msg = JSON.parse(payload.toString());
                this.dialer.addIceCandidate(msg.from, msg.candidate);
              }
              break;
            case "description_denied":
              {
                const msg = JSON.parse(payload.toString());
                this.dialer.removeConn(msg.from);
              }
              break;
            case "description_answer":
              {
                const msg = JSON.parse(payload.toString());
                this.dialer.descriptionCallback(msg.from, msg.desc);
              }
              break;
            case "description":
              {
                const msg = JSON.parse(payload.toString());
                this.dialer
                  .informOffer(msg.from, msg.desc)
                  .then((resp: any) => {
                    this.mqtt.publish(
                      `sessions/${msg.from}/description_answer`,
                      JSON.stringify({ from: this.id, desc: resp }),
                      { qos: qosLevel }
                    );
                  })
                  .catch(() => {
                    this.mqtt.publish(
                      `sessions/${msg.from}/description_denied`,
                      JSON.stringify({ from: this.id, }),
                      { qos: qosLevel }
                    );
                  });
              }
              break;
            default:
              console.warn("unknown rpc received:", topic);
          }
        }
      }
    });
    this.mqtt.on("connect", async () => {
      const topics = [
        `sessions/${this.id}/+`,
        `sessions/+`
      ]

      this.mqtt.subscribe(topics, { qos: qosLevel }, (err) => {
        if (err) {
          console.error("presence setup failed", err)
          return
        }
        console.log('presence setup')
        this.mqtt.publish(`sessions/${this.id}`, JSON.stringify({ id: this.id, name: this.name }), {
          qos: qosLevel,
          retain: true,
        }, (err) => {
          if (err) {
            console.error(err)
          }
        });
      });
      console.debug('connection to mqtt broker established')
    });
  }

  register(dialer: any) {
    this.dialer = dialer;
  }

  async signalCandidate(to: string, candidate: any): Promise<void> {
    return new Promise((resolve, reject) => {
      this.mqtt.publish(
        `sessions/${to}/candidate`,
        JSON.stringify({
          candidate,
          from: this.id,
        }),
        { qos: qosLevel },
        (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  }
  async sendDescription(to: string, desc: any): Promise<void> {
    return new Promise((resolve, reject) => {
      this.mqtt.publish(
        `sessions/${to}/description`,
        JSON.stringify({ from: this.id, desc: desc }),
        { qos: qosLevel },
        (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  }
}
