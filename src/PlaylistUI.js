/**
 * Copyright 2018 Daniel Rossi
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const events = flowplayer.events,
    mq = flowplayer.mq;

export default class PlaylistUI {
    constructor(root, onItemClick) {
        this.container = mq.div("fp-playlist");
        this.onItemClick = onItemClick;
        root.append(this.container);
    }

    /**
     * Create new playlist display from configured items
     */
    set playlist(items) {
        this.container.empty();
        items.forEach((itm, i) => {
            const item = mq.a(),
                href = itm.src[0].src;
            item.attr("href", href);
            item.attr("class", 0 === i ? "is-active" : undefined);
            item.attr("data-index", i);
            item.on(events.CLICK, (e) => {
                e.preventDefault();
                this.onItemClick(i);
            });
            //if (itm.title) item.txt(itm.title);
            this.container.append(item);
        });
    }

    /**
     * On item click
     * Gets the item index from the data attribute
     */
    onItemClick(e) {
        e.preventDefault();
        const el = e.currentTarget,
            toPlay = Number(el.getAttribute('data-index'));
        if (toPlay != -1) {
            this.onItemClick(toPlay);
        }
    }

    /**
     * Set the current playlist item index
     * Updates the active element.
     */
    set index(idx) {
        const prev = this.container.find("a.is-active"),
        prevIndex = prev && prev.getAttribute('data-index'),
        el = this.container.find('a[data-index="' + idx + '"]');
        
        if (prev) prev.toggleClass("is-active", false);
        if (el) el.toggleClass("is-active", true);
    }
}