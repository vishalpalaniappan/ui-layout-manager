import { useEffect, useMemo, useCallback } from "react";
import { useArgs } from "@storybook/preview-api";
import { LayoutManager } from "../components/LayoutManager";
import defaultLayoutJSON from "./layouts/vsCode/default.json";

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

