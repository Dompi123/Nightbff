// src/utils/eventEmitter.ts

type EventCallback<T = any> = (data?: T) => void;

interface Events {
  [eventName: string]: EventCallback[];
}

class EventEmitter {
  private events: Events = {};

  public on<T = any>(eventName: string, callback: EventCallback<T>): void {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(callback as EventCallback); // Cast to allow generic T
    console.log(`[EventEmitter] Listener added for event: ${eventName}`);
  }

  public off<T = any>(eventName: string, callback: EventCallback<T>): void {
    if (!this.events[eventName]) {
      console.warn(
        `[EventEmitter] No listeners for event: ${eventName} to remove.`,
      );
      return;
    }

    this.events[eventName] = this.events[eventName].filter(
      (cb) => cb !== (callback as EventCallback),
    );
    console.log(`[EventEmitter] Listener removed for event: ${eventName}`);
  }

  public emit<T = any>(eventName: string, data?: T): void {
    if (!this.events[eventName]) {
      // console.warn(`[EventEmitter] No listeners for event: ${eventName} to emit to.`);
      return; // It's okay if no one is listening yet, especially during setup
    }

    console.log(`[EventEmitter] Emitting event: ${eventName} with data:`, data);
    this.events[eventName].forEach((callback) => {
      try {
        callback(data);
      } catch (error) {
        console.error(
          `[EventEmitter] Error in callback for event ${eventName}:`,
          error,
        );
      }
    });
  }
}

const eventEmitter = new EventEmitter();
export default eventEmitter;
