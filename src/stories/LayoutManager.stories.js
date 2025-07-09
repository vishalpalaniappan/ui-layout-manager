import { useEffect } from "react";
import { useArgs } from "@storybook/preview-api";
import { action } from "@storybook/addon-actions";
import { LayoutManager } from "../components/LayoutManager";
import Layout2 from "./data/Layout2.json"

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


export const Default = Template.bind({})

Default.args = {
    layout: Layout2
}