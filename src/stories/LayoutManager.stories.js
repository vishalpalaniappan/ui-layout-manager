import { useEffect } from "react";
import { useArgs } from "@storybook/preview-api";
import { action } from "@storybook/addon-actions";
import { LayoutManager } from "../components/LayoutManager";
import defaultLayoutJSON from "./data/vsCode/default.json"
import twoEditorsJSON from "./data/vsCode/twoEditors.json"
import fourEditorsJSON from "./data/vsCode/fourEditors.json"
import variableTreeJSON from "./data/vsCode/VariableTree.json"
import variableTree2JSON from "./data/vsCode/VariableTreev2.json"
import aspJSON from "./data/vsCode/asp.json"

import "./LayoutManager.stories.scss";

export default {
    title: 'Editors', 
    component: LayoutManager,
    argTypes: {
        ldf: {
            type: 'object'
        }
    }
};

const Template = (args) => {
    const [, updateArgs] = useArgs();
    
    const registry = {
        EditorVSCode: () =>
            import('./sample_components/editor/EditorVSCode').then((m) => ({
            default: m.default || m.EditorVSCode,
        })),
        Stack: () =>
            import('./sample_components/stack/Stack').then((m) => ({
            default: m.default || m.Stack,
        })),
        Flow: () =>
            import('./sample_components/flow/Flow').then((m) => ({
            default: m.default || m.Flow,
        })),
    };

    useEffect(() => {
        updateArgs({registry : registry});
    }, []);

    return (
        <div className="rootContainer">
            <LayoutManager  {...args}/> 
        </div>
    )
}

export const defaultLayout = Template.bind({})

defaultLayout.args = {
    ldf: defaultLayoutJSON
}

export const twoEditors = Template.bind({})

twoEditors.args = {
    ldf: twoEditorsJSON
}

export const fourEditors = Template.bind({})

fourEditors.args = {
    ldf: fourEditorsJSON
}

export const variableTree = Template.bind({})

variableTree.args = {
    ldf: variableTreeJSON
}


export const variableTree2 = Template.bind({})

variableTree2.args = {
    ldf: variableTree2JSON
}

export const asp = Template.bind({})

asp.args = {
    ldf: aspJSON
}


