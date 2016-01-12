# jquery-ui-droppable-iframe
jQuery UI Plugin to enable draggables and droppables to work with iframes

# Summary
The jQuery UI user interface library currently does not support interactions with an iframe. This more or less means that attempting to drag an entity from the top window into a nested iframe will produce unexpected results.

An IFrame (Inline Frame) is an HTML document embedded inside another HTML document on a website. Such elements maintain their own document URIs, window dimensions, scrolling offsets, etc. As a result successfully interacting with an iframe requires extra consideration, specifically with respect to offsets.

This plugin seeks to resolve these issues. The current version:
- accounts for all offsets between the top window and a nested iframe
- accounts for vertical scrolling within the top window
- accounts for all scrolling within the iframe itself

The plugin does *not*:
- support multiple nested iframes (TBD)
- horizontal scrolling (TBD)

# Demo
See some basic examples [here](http://kamelkev.github.io/jquery-ui-droppable-iframe)

# Usage

The library works by overriding a deficient method contained with jquery-ui. To use it, simply include a script reference to the associated javascript immediately after you have referenced jquery-ui.

# Credits

Original code by [Craig Michael Thompson](http://blog.craigsworks.com); see [http://blog.craigsworks.com/jquery-ui-draggable-droppables-in-an-iframe](http://blog.craigsworks.com/jquery-ui-draggable-droppables-in-an-iframe)
