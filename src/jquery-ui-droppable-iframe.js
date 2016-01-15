// Create new object to cache iframe offsets
$.ui.ddmanager.frameOffsets = {};

// Override the native `prepareOffsets` method. This is almost
// identical to the un-edited method, except for the last part!
$.ui.ddmanager.prepareOffsets = function (t, event) {
    var i, j,
        m = $.ui.ddmanager.droppables[t.options.scope] || [],
        type = event ? event.type : null, // workaround for #2317
        list = (t.currentItem || t.element).find(":data(ui-droppable)").addBack(),
        doc, frameOffset, parentNodes;
 
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
        if (!m[i].visible) {
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
        typeof m[i].proportions === 'function' ? m[i].proportions(proportions) : (m[i].proportions = proportions);

        /* ============ Here comes the fun bit! =============== */
 
        // If the element is within an another document...
        if ((doc = m[i].document[0]) !== document) {
            var frameElement = (doc.defaultView || doc.parentWindow).frameElement; 

            // Determine in the frame offset using cached offset (if already calculated)
            frameOffset = $.ui.ddmanager.frameOffsets[doc];
            if (!frameOffset) {
                console.log('calculating, no cache found?');

                // Calculate offset, different browsers store it on different properties (IE...)
                frameOffset = $(frameElement).offset();

                // cache the offset in our new `$.ui.ddmanager.frameOffsets` object
                $.ui.ddmanager.frameOffsets[doc] = frameOffset;
            }

            console.log('Handling element: ' + i);

            // calculate the effective viewport boundaries containing the element, taking wrapping divs and soforth into account

            var frameRect = $(frameElement)[0].getBoundingClientRect();
            var viewportRect = { top: frameRect.top, bottom: frameRect.bottom, right: frameRect.right, left: frameRect.left };
            $(frameElement).parents().each(function() {
              var parentRect = this.getBoundingClientRect();

              viewportRect.left = viewportRect.left < parentRect.left ? parentRect.left : viewportRect.left;
              viewportRect.top = viewportRect.top < parentRect.top ? parentRect.top : viewportRect.top;

              viewportRect.right = viewportRect.right < parentRect.right ? viewportRect.right : parentRect.right;
              viewportRect.bottom = viewportRect.bottom < parentRect.bottom ? viewportRect.bottom : parentRect.bottom;
            });

            // calculate the effective element boundaries of the droppable element

            var abstractElementRect = m[i].element[0].getBoundingClientRect();
            var elementRect = { top: abstractElementRect.top, bottom: abstractElementRect.bottom, right: abstractElementRect.right, left: abstractElementRect.left };

            console.log(elementRect.top);
            console.log(elementRect.bottom);

            $(frameElement).parents().each(function() {
              console.log('extracting scroll from' + this.tagName);

              elementRect.left -= $(this).scrollLeft();
              elementRect.top -= $(this).scrollTop();

              elementRect.right -= $(this).scrollLeft();
              elementRect.bottom -= $(this).scrollTop();
            });

            console.log(elementRect.top);
            console.log(elementRect.bottom);

            // account for the offset between the viewport itself and the element

            elementRect.top += viewportRect.top;
            elementRect.bottom += viewportRect.top;
            elementRect.left += viewportRect.left;
            elementRect.right += viewportRect.left;

            console.log(elementRect.top);
            console.log(elementRect.bottom);

            var adjusted = 0;
            if (viewportRect.top > elementRect.top) {
               console.log('---------------- Truncated Top--------------');
               console.log('m[i].offset.top ' + m[i].offset.top);
               console.log('proportions.height ' + proportions.height); 

               proportions.height -= (viewportRect.top - elementRect.top);
               m[i].offset.top = viewportRect.top;
               m[i].offset.left = elementRect.left;

               adjusted = 1;
            }

            // bottom of frame < bottom element
            if (viewportRect.bottom < elementRect.bottom) {
               console.log('---------------- Truncated Bottom--------------');
               console.log('m[i].offset.top ' + m[i].offset.top);
               console.log('proportions.height ' + proportions.height);

               proportions.height -= (elementRect.bottom - viewportRect.bottom);
               m[i].offset.top = elementRect.top;
               m[i].offset.left = elementRect.left;

               adjusted = 1;
            }

            if (!adjusted) {
              console.log('---------------- Fully Exposed --------------');
              console.log('m[i].offset.top ' + m[i].offset.top);
              console.log('proportions.height ' + proportions.height);

              m[i].offset.top = elementRect.top;
              m[i].offset.left = elementRect.left;
            }

            console.log('modified proportions.height to' + proportions.height);
            console.log('modified m[i].offset.top to' + m[i].offset.top);
        }
    }
};
