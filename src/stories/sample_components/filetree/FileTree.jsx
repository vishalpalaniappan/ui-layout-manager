import { FileBrowser } from 'sample-ui-component-library';

import Tree1 from "./Tree1.json"

const FileTree = () => {
    return (
        <FileBrowser tree={Tree1.tree} />  
    );
};

export default FileTree;