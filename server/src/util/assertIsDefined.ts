export function assertIsDefined<T>(val: T): asserts val is NonNullable<T> {
    if (!val) {
        throw Error('Exoected val to be defined but recived ' + val)
    }
}