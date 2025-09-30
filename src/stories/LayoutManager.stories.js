import { useEffect, useMemo, useCallback } from "react";
import { useArgs } from "@storybook/preview-api";
import { LayoutManager } from "../components/LayoutManager";
import defaultLayoutJSON from "./layouts/vsCode/default.json";
import sample1JSON from "./layouts/vsCode/sample1.json";

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
        EditorVSCode: () =>
            import('./sample_components/editor/EditorVSCode').then((m) => ({
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
    }), []);

    useEffect(() => {
        updateArgs({registry : registry});
    }, [updateArgs, registry]);

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


export const sample1 = Template.bind({})

sample1.args = {
    ldf: sample1JSON
}

