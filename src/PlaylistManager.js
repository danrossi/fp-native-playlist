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
	util = flowplayer.util;

events.PLAYLIST_CHANGED = "playlistChanged";
events.PLAYLIST_ITEM_CHANGE = "playlistItemChange";
events.PLAYLIST_ITEM_CHANGED = "playlistItemChanged";

export default class PlaylistManager {
	
	constructor(opts, video) {
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
	config(i) {
		return util.extend(this.opts, this.playlistItem(i));
	}

	/** 
	 * Get current configured playlist
	 */
	get playlist() {
		return this.opts.playlist;
	}

	/**
	 * Update current playlist.
	 */
	set playlist(value) {
		this.opts.playlist = value;
	}

	/**
	 * Get playlist length
	 */
	get length() {
		return this.playlist.length - 1;
	}

	/**
	 * Set new playlist and send playlist change event.
	 */
	set newPlaylist(items) {
  		this.playlist = items;
     	this.video.emit(events.PLAYLIST_CHANGED, this.playlist);
    }

    /**
     * Get current playlist index
     */
    get index() {
    	this.video.index;
    }

    /**
     * Get playlist item
     */
	playlistItem(i) {
		return this.playlist[i];
	}

	/**
	 * Play item api
	 * Gets the new playlist item source config and sets new source
	 * sends playlist item change event.
	 */
	playItem(i) {
		const video = this.video;

		if (i === undefined) return video.togglePlay();
	    if (typeof i != 'number') return;
	  
	    if (i === video.index) {
	    	video.currentTime = 0;
	    	return;
	    } 

	    const opts = this.config(i);

	    //wait for load start then send item change event
	    video.once(events.LOAD_START, () => {
	    	this.onItemChanged(i, opts);
	    });

	    video.emit(events.PLAYLIST_ITEM_CHANGE, opts);

	    //set the new source
	    video.setSrc(opts.src);
	}

	/**
	 * Next playlist item api
	 */
	nextItem() {
		const video = this.video;

      	let current = video.index;
      
    	if (current != -1) {
        	current = current === this.length ? 0 : current + 1;
        	this.playItem(current);
      	}
    }

    /**
     * Previous playlist item api
     */
    prevItem() {
      
      const video = this.video;
      let current = video.index;

      if (current != -1) {
         current = current === 0 ? this.length : current - 1;
         this.playItem(current);
      }
  	}

  	/**
  	 * Add new item to current playlist
  	 * Sends a playlist change event
  	 */
    addToPlaylist(item) {
    	delete this.video.is_last;
    	const pl = this.playlist;
    	this.newPlaylist = pl.concat([item]);
 	}

 	/**
 	 * Removes an item from the playlist.
 	 * Sends a playlist change event.
 	 */
 	removeFromPlaylist(idx) {
    	const pl = this.playlist;
    	this.newPlaylist = pl.slice(0, idx).concat(pl.slice(idx+1));
 	}

 	/**
 	 * Dispatch playlist item change event on load start
 	 */
	onItemChanged(i, opts) {
		const video = this.video;

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
	addApi(video) {
		video.playItem = (i) => this.playItem(i);
		video.next = () => this.nextItem;
		video.prev = () => this.prevItem;
		video.setPlaylist = (items) => this.newPlaylist = items;
		video.addToPlaylist = (item) => this.addToPlaylist(item);
		video.removeFromPlaylist = (idx) => this.removeFromPlaylist(idx); 
	}
}