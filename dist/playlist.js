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
	    util = flowplayer.util;

	events.PLAYLIST_CHANGED = "playlistChanged";
	events.PLAYLIST_ITEM_CHANGE = "playlistItemChange";
	events.PLAYLIST_ITEM_CHANGED = "playlistItemChanged";

	var PlaylistManager = function () {
		function PlaylistManager(opts, video) {
			classCallCheck(this, PlaylistManager);

			this.opts = opts;
			this.video = video;

			this.config(0);
			this.video.index = 0;
			this.addApi(video);
		}

		/**
	  * setter for current playlist source.
	  * copies item properties to the main player options.
	  */


		createClass(PlaylistManager, [{
			key: "config",
			value: function config(i) {
				return util.extend(this.opts, this.playlistItem(i));
			}

			/** 
	   * Get current configured playlist
	   */

		}, {
			key: "playlistItem",


			/**
	   * Get playlist item
	   */
			value: function playlistItem(i) {
				return this.playlist[i];
			}

			/**
	   * Play item api
	   * Gets the new playlist item source config and sets new source
	   * sends playlist item change event.
	   */

		}, {
			key: "playItem",
			value: function playItem(i) {
				var _this = this;

				var video = this.video;

				if (i === undefined) return video.togglePlay();
				if (typeof i != 'number') return;

				if (i === video.index) {
					video.currentTime = 0;
					return;
				}

				var opts = this.config(i);

				//wait for load start then send item change event
				video.once(events.LOAD_START, function () {
					_this.onItemChanged(i, opts);
				});

				video.emit(events.PLAYLIST_ITEM_CHANGE, opts);

				//set the new source
				video.setSrc(opts.src);
			}

			/**
	   * Next playlist item api
	   */

		}, {
			key: "nextItem",
			value: function nextItem() {
				var video = this.video;

				var current = video.index;

				if (current != -1) {
					current = current === this.length ? 0 : current + 1;
					this.playItem(current);
				}
			}

			/**
	   * Previous playlist item api
	   */

		}, {
			key: "prevItem",
			value: function prevItem() {

				var video = this.video;
				var current = video.index;

				if (current != -1) {
					current = current === 0 ? this.length : current - 1;
					this.playItem(current);
				}
			}

			/**
	   * Add new item to current playlist
	   * Sends a playlist change event
	   */

		}, {
			key: "addToPlaylist",
			value: function addToPlaylist(item) {
				delete this.video.is_last;
				var pl = this.playlist;
				this.newPlaylist = pl.concat([item]);
			}

			/**
	   * Removes an item from the playlist.
	   * Sends a playlist change event.
	   */

		}, {
			key: "removeFromPlaylist",
			value: function removeFromPlaylist(idx) {
				var pl = this.playlist;
				this.newPlaylist = pl.slice(0, idx).concat(pl.slice(idx + 1));
			}

			/**
	   * Dispatch playlist item change event on load start
	   */

		}, {
			key: "onItemChanged",
			value: function onItemChanged(i, opts) {
				var video = this.video;

				//set the current index
				video.index = i;
				video.is_last = i == this.length;

				//send the item changed event
				video.emit(events.PLAYLIST_ITEM_CHANGED, opts);

				//toggle to continue playback.
				//video.togglePlay();
				if (video.paused) video.play();
			}

			/**
	   * Adds player methods api
	   */

		}, {
			key: "addApi",
			value: function addApi(video) {
				var _this2 = this;

				video.playItem = function (i) {
					return _this2.playItem(i);
				};
				video.next = function () {
					return _this2.nextItem;
				};
				video.prev = function () {
					return _this2.prevItem;
				};
				video.setPlaylist = function (items) {
					return _this2.newPlaylist = items;
				};
				video.addToPlaylist = function (item) {
					return _this2.addToPlaylist(item);
				};
				video.removeFromPlaylist = function (idx) {
					return _this2.removeFromPlaylist(idx);
				};
			}
		}, {
			key: "playlist",
			get: function get$$1() {
				return this.opts.playlist;
			}

			/**
	   * Update current playlist.
	   */
			,
			set: function set$$1(value) {
				this.opts.playlist = value;
			}

			/**
	   * Get playlist length
	   */

		}, {
			key: "length",
			get: function get$$1() {
				return this.playlist.length - 1;
			}

			/**
	   * Set new playlist and send playlist change event.
	   */

		}, {
			key: "newPlaylist",
			set: function set$$1(items) {
				this.playlist = items;
				this.video.emit(events.PLAYLIST_CHANGED, this.playlist);
			}

			/**
	   * Get current playlist index
	   */

		}, {
			key: "index",
			get: function get$$1() {
				this.video.index;
			}
		}]);
		return PlaylistManager;
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

	    var events = flowplayer.events,
	        plManager = new PlaylistManager(opts, video);

	    video.on(events.ENDED, function () {
	        var advance = typeof opts.advance === 'undefined' ? true : opts.advance,
	            index = plManager.index,
	            length = plManager.length;
	        if (!advance) return;

	        var next = index + 1;

	        if (next < length || opts.loop) {
	            next = next === length ? 0 : next;
	            plManager.playItem(next);
	        } else {
	            if (playlist.length > 1) {
	                plManager.playItem(0);
	            }
	        }
	    });

	    video.on(events.MOUNT, function () {
	        video.emit(events.PLAYLIST_CHANGED, plManager.playlist);
	    });
	});

})));
