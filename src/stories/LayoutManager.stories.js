import { useEffect } from "react";
import { useArgs } from "@storybook/preview-api";
import { action } from "@storybook/addon-actions";
import { LayoutManager } from "../components/LayoutManager";
import Layout2 from "./data/Layout2.json"
import Layout3 from "./data/Layout3.json"
import Layout4 from "./data/Layout4.json"
import Layout5 from "./data/Layout5.json"
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
    title:"asdf",
    layout: Layout2
}

export const colrowlayout = Template.bind({})

colrowlayout.args = {
    layout: Layout3
}

export const mixedlayout = Template.bind({})

mixedlayout.args = {
    layout: Layout4
}

export const denseLayout = Template.bind({})

denseLayout.args = {
    layout: Layout5
}

export const vsCodeLayout = Template.bind({})

vsCodeLayout.args = {
    layout: vsCodeLayoutJSON
}