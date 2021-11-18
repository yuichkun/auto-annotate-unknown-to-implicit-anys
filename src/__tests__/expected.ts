function returnsExplicitAny() {
    // This should stay intact because explicity defined as any
    return 3 as any
}

// This should stay intact because explicity defined as any
const anyObject = {} as any

export class TestClass {
    referencedAny() {
        return anyObject
    }
    // this should be annotated as unknown because it is not referenced
    unreferencedAny() {
        return anyObject
    }

    shouldFail() {
        // this should fail because only any type can allow this
        console.log(this.referencedAny().foo)
    }

    referencedImplicitAnyParam(params) {
        // this should fail because only any type can allow this
        console.log(params.foo)
    }
    // this should be annotated as unknown because it is not referenced
    unreferencedImplicitAnyParam(params: unknown) { }
}