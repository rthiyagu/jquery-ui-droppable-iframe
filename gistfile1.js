$.ui.ddmanager.frameOffsets = {};
$.ui.ddmanager.prepareOffsets = function (t, event) {
    var i, j,
        m = $.ui.ddmanager.droppables[t.options.scope] || [],
        type = event ? event.type : null, // workaround for #2317
        list = (t.currentItem || t.element).find(":data(ui-droppable)").addBack(),
        doc, frameOffset;

    droppablesLoop: for (i = 0; i < m.length; i++) {

        //No disabled and non-accepted
        if (m[i].options.disabled || (t && !m[i].accept.call(m[i].element[0], (t.currentItem || t.element)))) {
            continue;
        }

        // Filter out elements in the current dragged item
        for (j = 0; j < list.length; j++) {
            if (list[j] === m[i].element[0]) {
                m[i].proportions.height = 0;
                continue droppablesLoop;
            }
        }

        m[i].visible = m[i].element.css("display") !== "none";
        if (!m[i].visible) {
            continue;
        }

        //Activate the droppable if used directly from draggables
        if (type === "mousedown") {
            m[i]._activate.call(m[i], event);
        }

        m[i].offset = m[i].element.offset();

        // If the element is within an another document...
        if ((doc = m[i].document[0]) !== document) {
            // Determine in the fame offset using cached offset (if already calculated)
            frameOffset = $.ui.ddmanager.frameOffsets[doc];
            if (!frameOffset) {
                frameOffset = $.ui.ddmanager.frameOffsets[doc] =
                    $((m[i].document[0].defaultView || m[i].document[0].parentWindow).frameElement).offset();
            }

            // Add the frame offset to the calculated offset
            m[i].offset.left += frameOffset.left;
            m[i].offset.top += frameOffset.top;

            // Re-calculate proportions
            m[i].proportions = { width: m[i].element[0].offsetWidth, height: m[i].element[0].offsetHeight };
        }
    }
};