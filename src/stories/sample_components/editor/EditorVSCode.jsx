// EditorVSCode.js
import { Editor } from 'sample-ui-component-library';
import fileTree from "./filetree.json"

const EditorVSCode = () => {
    return (
        <Editor systemTree={fileTree.fileTrees} />  
    );
};

export default EditorVSCode;