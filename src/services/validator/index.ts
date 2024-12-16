import React from "react";
import { z } from "zod";

export default class Validator {
  private static schema: z.ZodType;
  constructor() { }

  static UseSchema(targetSchema: z.ZodType) {
    this.schema = targetSchema;
    return this;
  }

  static SafeValidate<T, S>(
    value: T,
    setErrorMessage: React.Dispatch<React.SetStateAction<S>>
  ): boolean {
    let validate = this.schema.safeParse(value);
    if (!validate.success) {
      let errMsg = validate.error.flatten().fieldErrors;
      setErrorMessage(errMsg as S)
      return false;
    }

    setErrorMessage({} as S)
    return true;
  }
}
