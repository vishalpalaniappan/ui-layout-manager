import { useEffect, useMemo, useCallback } from "react";
import { useArgs } from "@storybook/preview-api";
import { LayoutManager } from "../components/LayoutManager";
import defaultLayoutJSON from "./layouts/vsCode/default.json";
import sample1JSON from "./layouts/vsCode/sample1.json";
import workbenchJSON from "./layouts/vsCode/workbench.json";
import workbench2JSON from "./layouts/vsCode/workbench2.json";
import workbench3JSON from "./layouts/vsCode/workbench3.json";

import { LayoutEventProvider } from "../components/LayoutManager/Providers/LayoutEventProvider";

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
    
    const registry = useMemo(() => ({
        FileEditor: () =>
            import('./sample_components/fileeditor/FileEditor').then((m) => ({
            default: m.default,
        })),
        Stack: () =>
            import('./sample_components/stack/Stack').then((m) => ({
            default: m.default,
        })),
        Flow: () =>
            import('./sample_components/flow/Flow').then((m) => ({
            default: m.default,
        })),
        MapSample: () =>
            import('./sample_components/map/MapSample').then((m) => ({
            default: m.default,
        })),
        FileTree: () =>
            import('./sample_components/filetree/FileTree').then((m) => ({
            default: m.default,
        })),
    }), []);

    useEffect(() => {
        updateArgs({registry : registry});
    }, [updateArgs, registry]);

    return (
        <LayoutEventProvider>
            <div className="rootContainer">
                <LayoutManager  {...args}/> 
            </div>
        </LayoutEventProvider>
    )
}

export const defaultLayout = Template.bind({})

defaultLayout.args = {
    ldf: defaultLayoutJSON
}


export const sample1 = Template.bind({})

sample1.args = {
    ldf: sample1JSON
}


export const workbench = Template.bind({})

workbench.args = {
    ldf: workbenchJSON
}


export const workbench2 = Template.bind({})

workbench2.args = {
    ldf: workbench2JSON
}


export const workbench3 = Template.bind({})

workbench3.args = {
    ldf: workbench3JSON
}


