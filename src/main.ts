import { MethodDeclaration, Node, ParameterDeclaration, Project } from "ts-morph"
console.log('start')

const strictProject = new Project(
    {
        tsConfigFilePath: "tsconfig.strict.json",
        skipAddingFilesFromTsConfig: true,
    }
)

const looseProject = new Project(
    {
        tsConfigFilePath: "tsconfig.loose.json",
        skipAddingFilesFromTsConfig: true,
    }
)

function addExampleFile(project: Project) {
    const example = project.addSourceFileAtPathIfExists('./src/__tests__/example.ts')
    if (!example) throw new Error('example file not found')
    project.resolveSourceFileDependencies()
    return example
}

const strictExampleSourceFile = addExampleFile(strictProject)

strictExampleSourceFile.forEachDescendant(node => {
    if (Node.isMethodDeclaration(node)) {
        const params = node.getParameters()
        const hasParams = params.length > 0
        if (!hasParams) return
        console.log('======')
        console.log(node.getKindName())
        console.log(node.getText())
        params.forEach(param => replaceAnyWithUnknown(param, node))
    }
})

strictExampleSourceFile.save()

function replaceAnyWithUnknown(param: ParameterDeclaration, node: MethodDeclaration) {
    // if explicity typed, it does not have a TypeNode, therefore skip the replacement
    const typeNode = param.getTypeNode()
    if(typeNode) return

    // if the type is not any skip the replacement
    const type = param.getType()
    if(!type.isAny()) return

    // if the param has references, then skip the replacement
    const refs = param.findReferencesAsNodes()
    if(refs.length > 0) return

    console.log('----will replace the following----')
    param.setType('unknown')

    console.log(node.getText())
    console.log(param.getText())
    console.log(type.getText())
}



