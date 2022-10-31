import { IMethod } from "./IMethod";

export interface IClass {
  type: "class",
  typeName: string,
  name: string,
  methods: IMethod[]
}
