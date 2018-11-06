// @flow
import type { JpathKey } from '@stackstorm/st2flow-yaml';

export type TransitionType = 'Success' | 'Error' | 'Complete'

export interface CanvasPoint {
    x: number;
    y: number
}

export interface TaskInterface {
    name: string;
    action: string;
    transitions?: Array<TransitionInterface>;

    input?: Object;
    coords: CanvasPoint;
    size?: CanvasPoint;

    with?: {
        items: string,
        concurrency?: string,
    };
    join?: string;
}

export interface TaskRefInterface {
    workflow?: string;
    name: string;
}

export interface TransitionInterface {
    from: TaskRefInterface;
    to: TaskRefInterface;
    type?: TransitionType;
    condition?: string;
    publish?: Object;
}

export interface TransitionRefInterface {
    from: TaskRefInterface;
    to: TaskRefInterface;
    condition?: string;
}

export interface ModelInterface {
    +version: number;
    +description: string;
    +tasks: Array<TaskInterface>;
    +transitions: Array<TransitionInterface>;

    +lastTaskIndex: number;

    // These intentionally return void to prevent chaining
    // Consumers are responsible for cleaning up after themselves
    on(event: string, callback: Function): void;
    removeListener(event: string, callback: Function): void;

    constructor(yaml: string): void;
    fromYAML(yaml: string): void;
    toYAML(): string;

    addTask(opts: TaskInterface): void;
    updateTask(ref: TaskRefInterface, opts: any): void;
    deleteTask(ref: TaskRefInterface): void;

    setTaskProperty(ref: TaskRefInterface, path: JpathKey , value: any): void;
    deleteTaskProperty(ref: TaskRefInterface, path: JpathKey): void;

    addTransition(opts: TransitionInterface): void;
    updateTransition(ref: TransitionRefInterface, opts: TransitionInterface): void;
    deleteTransition(ref: TransitionRefInterface): void;

    setTransitionProperty(ref: TransitionRefInterface, path: JpathKey , value: any): void;
    deleteTransitionProperty(ref: TransitionRefInterface, path: JpathKey): void;

    undo(): void;
    redo(): void;
}

export interface EditorPoint {
    row: number;
    column: number;
}

export interface DeltaInterface {
    start: EditorPoint;
    end: EditorPoint;
    action: 'insert' | 'remove';
    lines: Array<string>;
}

export interface AjvError {
  dataPath: string,
  keyword: string,
  message: string,
  params: Object
}

export interface GenericError {
  message: string
}
