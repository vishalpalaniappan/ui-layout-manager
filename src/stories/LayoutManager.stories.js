import { useEffect } from "react";
import { useArgs } from "@storybook/preview-api";
import { action } from "@storybook/addon-actions";
import { LayoutManager } from "../components/LayoutManager";
import rowCollLayoutJSON from "./data/row-coll-Layout.json"
import Layout3 from "./data/Layout3.json"
import mixedLayoutJSON from "./data/mixedLayout.json"
import denseLayoutJSON from "./data/denseLayout.json"
import vsCodeLayoutJSON from "./data/vsCodeLayout.json"

export default {
    title: 'LayoutManager', 
    component: LayoutManager,
    argTypes: {
        layout: {
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


export const rowcollayout = Template.bind({})

rowcollayout.args = {
    layout: rowCollLayoutJSON
}

export const colrowlayout = Template.bind({})

colrowlayout.args = {
    layout: Layout3
}

export const mixedlayout = Template.bind({})

mixedlayout.args = {
    layout: mixedLayoutJSON
}

export const denseLayout = Template.bind({})

denseLayout.args = {
    layout: denseLayoutJSON
}

export const VSCodeLayout = Template.bind({})

VSCodeLayout.args = {
    layout: vsCodeLayoutJSON
}