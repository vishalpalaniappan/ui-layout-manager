import { StackList } from 'sample-ui-component-library';

const Stack = () => {

    const args = [
        {functionName:"visit_arg", fileName: "helper.py", lineNumber: 3},
        {functionName:"__init__", fileName: "helper.py", lineNumber: 65},
        {functionName:"injectLogTypesA", fileName: "LogInjector.py", lineNumber: 3, selected: true},
        {functionName:"visit_import", fileName: "LogInjector.py", lineNumber: 3},
        {functionName:"__init__", fileName: "LogInjector.py", lineNumber: 65},
        {functionName:"run", fileName: "ProgramProcessor.py", lineNumber: 3},
        {functionName:"main", fileName: "main.py", lineNumber: 3},
        {functionName:"<module>", fileName: "main.py", lineNumber: 65}
    ]

    return (
        <StackList traces={args} />  
    );
};

export default Stack;