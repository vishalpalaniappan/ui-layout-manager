const INITIAL_SIZE_MARGIN = 100;

/** 
 *  Given the size of the parent container, for each of the children, convert the initial
 *  size to a percentage and assign it to the container. Save the delta from the percentage
 *  specified in the LDF file and save it in a running sum. Then distribute the percentage 
 *  in the running sum to the rest of the children which had no initial size specified.
 *
 *  For example:
 *  Let's say that we have three columns as children in a container with initial width of 800.
 *  child1: {initialSize:200, percentage: 30}
 *  child2: {percentage: 40}
 *  child3: {initialSize:200, percentage: 30}
 *
 *  this will result in:
 *  child1: {initialSize:200, percentage: 25}
 *  child2: {percentage: 50}
 *  child3: {initialSize:200, percentage: 25}
 *
 *  This will result in child1 and child2 having a width of 25% and child2 having a percentage of 50%.
 * 
 *  If none of the children have an initial size specified or if the sum of the initial sizes of the 
 *  children is greater than the container size, return the layout without modifying it.
 * 
 * @param {Ref} containerRef Reference to the parent container to get the container size.
 * @param {Object} layout  Layout containing the children.
 * @param {String} dynamicProp The property (width or height) to resize.
 * @returns 
 */
export const calculateInitialSizes= (containerRef, layout, dynamicProp) => {
    const containerSize = containerRef.current.getBoundingClientRect()[dynamicProp];

    // TODO: This can be optimized a lot more and I think this will have to change 
    // once I start adding functionality to re-render containers progrmatically after
    // the initial render is complete. Leaving this todo to remind me.

    // Check if atleast one entry has an initial size
    const hasInitialSize = layout.children.some(child => 'initialSize' in child);
    if (!hasInitialSize) {
        return layout;
    }

    // Sum the initial specified sizes to verify that it is within the container size with a margin of INITIAL_SIZE_MARGIN pixels.
    let initialSizeSum = layout.children.reduce((sum, child) => sum + (child?.initialSize ?? 0), 0);
    if (initialSizeSum > containerSize - INITIAL_SIZE_MARGIN) {
        console.info("Initial size of containers is too large, using percentage sizes instead.");
        return layout;
    }

    // Assign percentage based on initial size and save the delta from the initial percentage
    // specified in the ldf file in a running sum to distribute to the children which had no 
    // initial size specified.
    let percentageLeft = 0;
    layout.children.forEach((child, index) => {
        if (child.type === "percent" && "initialSize" in child) {
            const initialPercentage = (child["initialSize"]/containerSize) * 100;
            percentageLeft += child[dynamicProp] - initialPercentage;
            child[dynamicProp] = initialPercentage;
        }
    });

    // Distribute the remaining percntage 
    const relativeContainers = layout.children.filter(child => !('initialSize' in child)).length;
    const percentageToAdd = percentageLeft / relativeContainers;    
    layout.children.forEach((child, index) => {
        if (child.type === "percent" && !("initialSize" in child)) {
            child[dynamicProp] = child[dynamicProp] + percentageToAdd;
        }
    });

    return layout;
}