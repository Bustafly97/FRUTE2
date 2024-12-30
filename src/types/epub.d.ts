declare module 'epubjs' {
  interface Book {
    spine: {
      spineItems: Array<{
        load(): Promise<string>;
      }>;
    };
    ready: Promise<void>;
  }

  interface EpubStatic {
    new(arrayBuffer: ArrayBuffer): Book;
  }

  declare global {
    interface Window {
      ePub: EpubStatic;
    }
  }
}