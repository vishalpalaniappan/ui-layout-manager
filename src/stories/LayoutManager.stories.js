import { useEffect } from "react";
import { useArgs } from "@storybook/preview-api";
import { action } from "@storybook/addon-actions";
import { LayoutManager } from "../components/LayoutManager";
import colRowLayoutJSON from "./data/colRowLayout.json"
import rowColLayoutJSON from "./data/rowColLayout.json"
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


export const rowColLayout = Template.bind({})

rowColLayout.args = {
    layout: rowColLayoutJSON
}

export const colRowLayout = Template.bind({})

colRowLayout.args = {
    layout: colRowLayoutJSON
}

export const mixedLayout = Template.bind({})

mixedLayout.args = {
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