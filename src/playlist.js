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

 import PlaylistManager from './PlaylistManager';

flowplayer(function(opts, root, video) {

	if (!opts.playlist) return;

  const events = flowplayer.events, 
  plManager = new PlaylistManager(opts, video);

  video.on(events.ENDED, function() {
      const advance = typeof opts.advance === 'undefined' ? true : opts.advance,
      index = plManager.index,
      length = plManager.length;

      if (!advance) return;
      
      let next = index >= 0 ? index + 1 : undefined;

      if (next < length || opts.loop) {
         next = next === length ? 0 : next;
         plManager.playItem(next);
      } else {
        if (playlist.length > 1) {
        	plManager.playItem(0);
      	}
      }
   });

   video.on(events.MOUNT, function() {
      video.emit(events.PLAYLIST_CHANGED, plManager.playlist);
   });

});