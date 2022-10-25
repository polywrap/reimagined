import { IFunction } from "./IFunction";

export interface IClass {
  type: "class",
  typeName: string,
  name: string,
  methods: IFunction[]
}
