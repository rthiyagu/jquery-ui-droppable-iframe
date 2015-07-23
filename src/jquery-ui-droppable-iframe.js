// Create new object to cache iframe offsets
$.ui.ddmanager.frameOffsets = {};

$.ui.ddmanager.isElementInViewport = function(el) {
    var rect = el.getBoundingClientRect();

    return rect.bottom > 0 &&
        rect.right > 0 &&
        rect.left < (window.innerWidth || document. documentElement.clientWidth) /*or $(window).width() */ &&
        rect.top < (window.innerHeight || document. documentElement.clientHeight) /*or $(window).height() */;
};
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
                m[i].proportions().height = 0;
                continue droppablesLoop;
            }
        }

        m[i].visible = m[i].element.css("display") !== "none";
        if (!m[i].visible || !$.ui.ddmanager.isElementInViewport(m[i].element[0])) {
            console.log('element is not visible, nothing to do');
            continue;
        }

        //Activate the droppable if used directly from draggables
        if (type === "mousedown") {
            m[i]._activate.call(m[i], event);
        }

        // Re-calculate offset
        m[i].offset = m[i].element.offset();

        // Re-calculate proportions (jQuery UI ~1.10 introduced a `proportions` cache method, so support both here!)
        proportions = { width: m[i].element[0].offsetWidth, height: m[i].element[0].offsetHeight };

        console.log('starting top offset is ' + m[i].offset.top);

        // If the element is within an another document...
        if ((doc = m[i].document[0]) !== document) {
            // Determine in the frame offset using cached offset (if already calculated)
            frameOffset = $.ui.ddmanager.frameOffsets[doc];
            if (!frameOffset) {
                // Calculate and cache the offset in our new `$.ui.ddmanager.frameOffsets` object
                // Different browsers store it on different properties (IE...)
                frameOffset = $.ui.ddmanager.frameOffsets[doc] = $((doc.defaultView || doc.parentWindow).frameElement).offset();
            }

            // Add the frame offset to the calculated offset
            m[i].offset.left += frameOffset.left;
            m[i].offset.top += frameOffset.top;

            console.log('frameset adjustment top offset is ' + m[i].offset.top);

            // If scrolled, re-calculate offset with respect to upper left corner of nested document
            m[i].offset.left -= m[i].element[0].ownerDocument.children[0].scrollLeft;
            m[i].offset.top -= m[i].element[0].ownerDocument.children[0].scrollTop;

            console.log('final adjustment top offset is ' + m[i].offset.top);

            console.log('frameOffset.top' + frameOffset.top);
            console.log('m[i].offset.top' + m[i].offset.top);

            if (frameOffset.top > m[i].offset.top) {
              proportions.height -= frameOffset.top - m[i].offset.top;
              m[i].offset.top = frameOffset.top;
              console.log('modified proportions to' + proportions.height);
            }

            // element is partially beyond the bottom of the frame
            if (frameOffset.top + doc.children[0].clientHeight < m[i].offset.top + m[i].element[0].scrollHeight) {
              proportions.height -= (m[i].offset.top + m[i].element[0].scrollHeight) - (frameOffset.top + doc.children[0].clientHeight);
              console.log('modified proportions to' + proportions.height);
            }
        }

        typeof m[i].proportions === 'function' ? m[i].proportions(proportions) : (m[i].proportions = proportions);
    }
};

