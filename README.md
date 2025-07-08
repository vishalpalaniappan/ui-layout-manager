# ui-layout-manager
A react component to manage layouts in complex applications.

> Note: This readme is informal right now but I will formalize it as the component is implemented.

## Background

As I began scoping out the observability platform from the ground up, it quickly became clear that the UI tools would become increasingly complex. The current approach of hardcoding UI layouts is not practical for managing more complex applications. This realization underscored the need for a layout manager, which motivated the development of this React component.

To ensure reusability and broad adoption, I decided to develop this layout manager as a standalone React library that can be integrated into any application.

### Features
This layout manager component will provide the following features:

- **JSON-Based Layout Definition**: Define the entire application layout through a structured JSON object.
- **Dynamic Component Injection**: Programmatically load components into designated containers within the layout.
- **Support for Multiple Layouts**: Define and switch between multiple layout configurations using JSON.
- **Theme Support**:
  - Define themes in JSON.
  - Load and apply themes dynamically across components.
- **Layout Persistence**:
  - Cache layout state to local storage.
  - Load the saved layout state automatically on startup.
- **Collapsible Containers**: Allow containers to collapse into side menus for a cleaner and more flexible UI.
- **Tabbed Containers**: Define tabs within a container, each capable of rendering a different custom component.
- **Resizable and Movable Containers**: All containers should be fully resizable and draggable, giving users complete control over their workspace layout.
  
The objective is to abstract all layout logic away from the application developer. Developers should be able to define a layout, register their components, and integrate everything into a single-page application—without needing to manage layout behavior themselves.

### Example JSON Document

To define the layout, the component will use a grid system represented by a JSON object. This grid system will allow developers to:
- Position and size containers on a grid
- Define which components go into each container
- Specify tabbed content within containers
- Configure collapsible menus for minimized or hidden containers

An example JSON schema will be provided as the layout specification is finalized. The design for collapsible menus will follow a model similar to applications like Adobe Photoshop, where panels can be collapsed and docked for space efficiency and quick access.



