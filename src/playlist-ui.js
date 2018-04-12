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

 import PlaylistUI from './PlaylistUI';

flowplayer(function(opts, root, video) {

    if (!opts.playlist) return;

    const ui = new PlaylistUI(root, (index) => video.playItem(index)),
    events = flowplayer.events;

	video.on(events.PLAYLIST_CHANGED, function(e) {
        //set new playlist on playlist change event
        ui.playlist = e.data;
    }).on(events.PLAYLIST_ITEM_CHANGE, function() {
        //set new item index on playlist item change event
        ui.index = video.index;
    });
});
