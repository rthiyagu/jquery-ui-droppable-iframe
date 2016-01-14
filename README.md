# jquery-ui-droppable-iframe
jQuery UI Plugin to enable draggables and droppables to work with iframes

# Summary
The jQuery UI user interface library currently does not support interactions with an iframe. This more or less means that attempting to drag an entity from the top window into a nested iframe will produce unexpected results.

An IFrame (Inline Frame) is an HTML document embedded inside another HTML document on a website. Such elements maintain their own document URIs, window dimensions, scrolling offsets, etc. As a result successfully interacting with an iframe requires extra consideration, specifically with respect to offsets.

This plugin seeks to resolve these issues. The current version:
- accounts for all offsets between the top window and a nested iframe
- accounts for vertical scrolling within the iframe itself
- accounts for vertical scrolling within the top window

The plugin does *not*:
- account for any scrolling made within intermediate elements between the iframe and the top window
- account for horizontal scrolling within both the iframe and top window
- support multiple nested iframes (TBD)

# Demo
See some basic examples [here](http://kamelkev.github.io/jquery-ui-droppable-iframe)

# Usage

The library works by overriding a deficient method contained with jquery-ui. To use it, simply include a script reference to the associated javascript immediately after you have referenced jquery-ui.

# Author

- [Kevin Kamel](https://github.com/kamelkev)

# Contributors

- [Chelsea Rio](http://github.com/chelseario)
- [Craig Michael Thompson](http://blog.craigsworks.com); see the original proposal that led to this plugin [here](http://blog.craigsworks.com/jquery-ui-draggable-droppables-in-an-iframe).

# Sponsor

This code has been developed under sponsorship of [MailerMailer LLC](http://www.mailermailer.com).
