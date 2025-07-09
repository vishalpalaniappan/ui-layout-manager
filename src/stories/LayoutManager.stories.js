import { useEffect } from "react";
import { useArgs } from "@storybook/preview-api";
import { action } from "@storybook/addon-actions";
import { LayoutManager } from "../components/LayoutManager";

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
        <LayoutManager  {...args}/> 
    )
}


export const Default = Template.bind({})

Default.args = {
    layout: {}
}