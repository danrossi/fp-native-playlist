(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(factory());
}(this, (function () { 'use strict';

	var classCallCheck = function (instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	};

	var createClass = function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];
	      descriptor.enumerable = descriptor.enumerable || false;
	      descriptor.configurable = true;
	      if ("value" in descriptor) descriptor.writable = true;
	      Object.defineProperty(target, descriptor.key, descriptor);
	    }
	  }

	  return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);
	    if (staticProps) defineProperties(Constructor, staticProps);
	    return Constructor;
	  };
	}();

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
	var events = flowplayer.events,
	    mq = flowplayer.mq;

	var PlaylistUI = function () {
	    function PlaylistUI(root, onItemClick) {
	        classCallCheck(this, PlaylistUI);

	        this.container = mq.div("fp-playlist");
	        this.onItemClick = onItemClick;
	        root.append(this.container);
	    }

	    /**
	     * Create new playlist display from configured items
	     */


	    createClass(PlaylistUI, [{
	        key: "onItemClick",


	        /**
	         * On item click
	         * Gets the item index from the data attribute
	         */
	        value: function onItemClick(e) {
	            e.preventDefault();
	            var el = e.currentTarget,
	                toPlay = Number(el.getAttribute('data-index'));
	            if (toPlay != -1) {
	                this.onItemClick(toPlay);
	            }
	        }

	        /**
	         * Set the current playlist item index
	         * Updates the active element.
	         */

	    }, {
	        key: "playlist",
	        set: function set$$1(items) {
	            var _this = this;

	            this.container.empty();
	            items.forEach(function (itm, i) {
	                var item = mq.a(),
	                    href = itm.src[0].src;
	                item.attr("href", href);
	                item.attr("class", 0 === i ? "is-active" : undefined);
	                item.attr("data-index", i);
	                item.on(events.CLICK, function (e) {
	                    e.preventDefault();
	                    _this.onItemClick(i);
	                });
	                //if (itm.title) item.txt(itm.title);
	                _this.container.append(item);
	            });
	        }
	    }, {
	        key: "index",
	        set: function set$$1(idx) {
	            var prev = this.container.find("a.is-active"),
	                prevIndex = prev && prev.getAttribute('data-index'),
	                el = this.container.find('a[data-index="' + idx + '"]');

	            if (prev) prev.toggleClass("is-active", false);
	            if (el) el.toggleClass("is-active", true);
	        }
	    }]);
	    return PlaylistUI;
	}();

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

	flowplayer(function (opts, root, video) {

	    if (!opts.playlist) return;

	    var ui = new PlaylistUI(root, function (index) {
	        return video.playItem(index);
	    }),
	        events = flowplayer.events;

	    video.on(events.PLAYLIST_CHANGED, function (e) {
	        //set new playlist on playlist change event
	        ui.playlist = e.data;
	    }).on(events.PLAYLIST_ITEM_CHANGE, function () {
	        //set new item index on playlist item change event
	        ui.index = video.index;
	    });
	});

})));
