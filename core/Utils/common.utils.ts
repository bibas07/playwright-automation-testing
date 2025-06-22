import test from "playwright/test";

export function AccessNestedObject<T>(
  obj: object | T[],
  path: string | string[],
  valueNotFound: any = undefined
): T {
  if (
    !(
      (Array.isArray(path) ||
        typeof path == "string" ||
        typeof path == "number") &&
      obj &&
      typeof obj == "object"
    )
  ) {
    return valueNotFound;
  }

  if (typeof path == "number") {
    path = String(path);
  }

  if (typeof path == "string") {
    path = path.split(".");
  }

  return path.reduce(
    (xs: any, x: string) => (xs && xs[x] != undefined ? xs[x] : valueNotFound),
    obj
  );
}

export function step(stepName?: string) {
  return function decorator(
    target: Function,
    context: ClassMemberDecoratorContext
  ) {
    return function replacementMethod(...args: any) {
      const name =
        stepName ?? this.contructor.name + "." + (context.name as string);

      return test.step(name, async () => {
        return await target.call(this, ...args);
      });
    };
  };
}
