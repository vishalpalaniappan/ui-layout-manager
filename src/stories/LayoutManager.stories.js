import { useEffect } from "react";
import { useArgs } from "@storybook/preview-api";
import { action } from "@storybook/addon-actions";
import { LayoutManager } from "../components/LayoutManager";
import vsCodeLayoutJSON from "./data/vsCodeLayout.json"

export default {
    title: 'Layout With Resizing', 
    component: LayoutManager,
    argTypes: {
        ldf: {
            type: 'object'
        }
    }
};

const Template = (args) => {

    return (
        <div style={{"position":"absolute", "top": 0, left:0, right:0, bottom:0}}>
            <LayoutManager  {...args}/> 
        </div>
    )
}

export const VSCodeLayout = Template.bind({})

VSCodeLayout.args = {
    ldf: vsCodeLayoutJSON
}