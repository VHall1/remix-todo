// https://github.com/jenseng/abuse-the-platform/blob/2993a7e846c95ace693ce61626fa072174c8d9c7/app/utils/singleton.ts

// since the dev server re-requires the bundle, do some shenanigans to make certain things persist across
// that 😆

export function singleton<T>(name: string, value: () => T): T {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const yolo = global as any;
  yolo.__singletons ??= {};
  yolo.__singletons[name] ??= value();
  return yolo.__singletons[name];
}
