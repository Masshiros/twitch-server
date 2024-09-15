export abstract class BaseMapper<I, O> {
  abstract mapFrom(param: I): O
  abstract mapTo(param: O): I
}
