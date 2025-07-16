// EditorVSCode.js
import { Viewer } from 'asp-react-component-library';
import fileTree from "./filetree.json"

const EditorVSCode = () => {
    return (
        <Viewer systemTree={fileTree.fileTrees} />  
    );
};

export default EditorVSCode;