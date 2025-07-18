import SampleTree from "./SampleTree.json"
import { FlowDiagram } from 'sample-ui-component-library';

const Flow = () => {
    return (
        <FlowDiagram treeInfo={SampleTree} />  
    );
};

export default Flow;